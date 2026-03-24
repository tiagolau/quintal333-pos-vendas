import { NextResponse } from "next/server";
import { store } from "@/lib/mock-data";

export async function GET() {
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const reviews = store.reviews;
  const totalReviews = reviews.length;
  const totalCustomers = store.customers.length;
  const newCustomersWeek = store.customers.filter((c) => c.created_at >= weekAgo).length;
  const couponsIssued = store.coupons.length;
  const couponsRedeemed = store.coupons.filter((c) => c.redeemed).length;

  let avgPizza = 0, avgService = 0, avgAmbiance = 0;
  if (reviews.length > 0) {
    avgPizza = reviews.reduce((s, r) => s + r.pizza_rating, 0) / reviews.length;
    avgService = reviews.reduce((s, r) => s + r.service_rating, 0) / reviews.length;
    avgAmbiance = reviews.reduce((s, r) => s + r.ambiance_rating, 0) / reviews.length;
  }

  return NextResponse.json({
    total_reviews: totalReviews,
    avg_pizza: Number(avgPizza.toFixed(1)),
    avg_service: Number(avgService.toFixed(1)),
    avg_ambiance: Number(avgAmbiance.toFixed(1)),
    total_customers: totalCustomers,
    new_customers_week: newCustomersWeek,
    coupons_issued: couponsIssued,
    coupons_redeemed: couponsRedeemed,
  });
}
