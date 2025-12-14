import { neon } from "@neon/serverless";

const databaseUrl = Deno.env.get("DATABASE_URL")!;

const sql = neon(databaseUrl);

Deno.cron("Release reserved numbers expired", { minute: 1 }, async () => {
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

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
// if (import.meta.main) {
//   console.log("Add 2 + 3 =", add(2, 3));
// }
