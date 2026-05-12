import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const [reviewsRes, customersRes, newCustomersRes, couponsRes, redeemedRes] =
    await Promise.all([
      supabaseAdmin.from("reviews").select("pizza_rating,service_rating,ambiance_rating"),
      supabaseAdmin.from("customers").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("customers")
        .select("id", { count: "exact", head: true })
        .gte("created_at", weekAgo),
      supabaseAdmin.from("coupons").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("coupons")
        .select("id", { count: "exact", head: true })
        .eq("redeemed", true),
    ]);

  if (reviewsRes.error) console.error("stats:reviews", reviewsRes.error);

  const reviews = reviewsRes.data ?? [];
  const totalReviews = reviews.length;

  let avgPizza = 0, avgService = 0, avgAmbiance = 0;
  if (totalReviews > 0) {
    avgPizza = reviews.reduce((s, r) => s + r.pizza_rating, 0) / totalReviews;
    avgService = reviews.reduce((s, r) => s + r.service_rating, 0) / totalReviews;
    avgAmbiance = reviews.reduce((s, r) => s + r.ambiance_rating, 0) / totalReviews;
  }

  return NextResponse.json({
    total_reviews: totalReviews,
    avg_pizza: Number(avgPizza.toFixed(1)),
    avg_service: Number(avgService.toFixed(1)),
    avg_ambiance: Number(avgAmbiance.toFixed(1)),
    total_customers: customersRes.count ?? 0,
    new_customers_week: newCustomersRes.count ?? 0,
    coupons_issued: couponsRes.count ?? 0,
    coupons_redeemed: redeemedRes.count ?? 0,
  });
}
