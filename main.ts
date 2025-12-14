import { neon } from "@neon/serverless";
import { checkAndGrantMonthlyAllowance } from "./lib/monthly-allowance.ts";

const databaseUrl = Deno.env.get("DATABASE_URL")!;

const sql = neon(databaseUrl);

Deno.cron("Release reserved numbers expired", "*/10 * * * *", async () => {
  try {
    await sql`update
                number_slots
              set
                status = 'available',
                reserved_at = null,
                expires_at = null,
                updated_at = now()
              where
                status = 'reserved'
                and expires_at < now();`;
  } catch (err) {
    console.error("Error releasing reserved numbers:", err);
  }
});

Deno.cron("Add to users - free monthly allowance", "0 0 1 * *", () => {
  checkAndGrantMonthlyAllowance(sql).catch((err) => {
    console.error("Error granting monthly allowance:", err);
  });
});

Deno.serve((_) => {
  return new Response("Giway Cron Jobs is running.");
});

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
// if (import.meta.main) {
// }
