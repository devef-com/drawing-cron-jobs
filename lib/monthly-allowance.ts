// Monthly allowance configuration (only for play_with_numbers)
export const MONTHLY_ALLOWANCE = {
  participants: Deno.env.get("MONTHLY_ALLOWANCE_PARTICIPANTS"),
  images: Deno.env.get("MONTHLY_ALLOWANCE_IMAGES"),
  emails: Deno.env.get("MONTHLY_ALLOWANCE_EMAILS"),
  giwayType: "play_with_numbers" as const,
};

// deno-lint-ignore no-explicit-any
export async function checkAndGrantMonthlyAllowance(sql: any) {
  await sql`
      INSERT INTO "pack_redemptions" (
        "user_id", "pack_id", "source", "coupon_id", "giway_type",
        "participants", "images", "emails", "amount_paid", "created_at"
      )
      SELECT
        u."id", NULL, 'monthly', NULL, ${MONTHLY_ALLOWANCE.giwayType},
        ${MONTHLY_ALLOWANCE.participants}, ${MONTHLY_ALLOWANCE.images}, ${MONTHLY_ALLOWANCE.emails}, 0, NOW()
      FROM "user" u
      WHERE NOT EXISTS (
        SELECT 1 FROM "pack_redemptions" pr
        WHERE pr."user_id" = u."id"
          AND pr."source" = 'monthly'
          AND pr."created_at" >= date_trunc('month', NOW())
      );
  `;
}
