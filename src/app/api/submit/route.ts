import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

    const { data: upserted, error: upsertError } = await supabaseAdmin
      .from("customers")
      .upsert(
        {
          name: customer.name.trim(),
          phone: customer.phone,
          birthday: customer.birthday || null,
          accepts_whatsapp: !!customer.accepts_whatsapp,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "phone" }
      )
      .select("id")
      .single();

    if (upsertError || !upserted) {
      console.error("submit:upsert", upsertError);
      return NextResponse.json(
        { error: "Erro ao salvar cliente" },
        { status: 500 }
      );
    }

    const customerId = upserted.id;

    const { data: review, error: reviewError } = await supabaseAdmin
      .from("reviews")
      .insert({
        customer_id: customerId,
        pizza_rating: ratings.pizza,
        service_rating: ratings.service,
        ambiance_rating: ratings.ambiance,
        comment: ratings.comment?.trim() || null,
        visit_type: "dine_in",
      })
      .select("id")
      .single();

    if (reviewError || !review) {
      console.error("submit:review", reviewError);
      return NextResponse.json(
        { error: "Erro ao salvar avaliação" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      customer_id: customerId,
      review_id: review.id,
    });
  } catch (e) {
    console.error("submit:exception", e);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
