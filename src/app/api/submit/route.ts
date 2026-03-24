import { NextResponse } from "next/server";
import { store } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const { customer, ratings } = await request.json();

    if (
      !customer?.name?.trim() ||
      !customer?.phone ||
      customer.phone.length < 10
    ) {
      return NextResponse.json(
        { error: "Nome e WhatsApp sao obrigatorios" },
        { status: 400 }
      );
    }

    if (!ratings?.pizza || !ratings?.service || !ratings?.ambiance) {
      return NextResponse.json(
        { error: "Todas as avaliacoes sao obrigatorias" },
        { status: 400 }
      );
    }

    // Upsert customer
    let existing = store.customers.find((c) => c.phone === customer.phone);
    let customerId: string;

    if (existing) {
      customerId = existing.id;
      existing.name = customer.name;
      existing.birthday = customer.birthday || null;
      existing.accepts_whatsapp = customer.accepts_whatsapp;
      existing.updated_at = new Date().toISOString();
    } else {
      customerId = store.uid();
      store.customers.push({
        id: customerId,
        name: customer.name,
        phone: customer.phone,
        birthday: customer.birthday || null,
        accepts_whatsapp: customer.accepts_whatsapp,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Create review
    const reviewId = store.uid();
    store.reviews.push({
      id: reviewId,
      customer_id: customerId,
      pizza_rating: ratings.pizza,
      service_rating: ratings.service,
      ambiance_rating: ratings.ambiance,
      comment: ratings.comment?.trim() || null,
      visit_type: "dine_in",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      customer_id: customerId,
      review_id: reviewId,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
