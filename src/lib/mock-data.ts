import type { Customer, Prize } from "./types";

// In-memory store (resets on each deploy/restart — fine for demo)
function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400000).toISOString();
}

const SEED_CUSTOMERS: Customer[] = [
  { id: "c1", name: "Mariana Silva", phone: "33991234567", birthday: "1990-06-15", accepts_whatsapp: true, created_at: daysAgo(20), updated_at: daysAgo(20) },
  { id: "c2", name: "Pedro Henrique", phone: "33992345678", birthday: "1985-11-02", accepts_whatsapp: true, created_at: daysAgo(18), updated_at: daysAgo(18) },
  { id: "c3", name: "Camila Oliveira", phone: "33993456789", birthday: null, accepts_whatsapp: true, created_at: daysAgo(15), updated_at: daysAgo(15) },
  { id: "c4", name: "Lucas Mendes", phone: "33994567890", birthday: "1992-03-20", accepts_whatsapp: false, created_at: daysAgo(12), updated_at: daysAgo(12) },
  { id: "c5", name: "Ana Beatriz", phone: "33995678901", birthday: "1998-08-10", accepts_whatsapp: true, created_at: daysAgo(10), updated_at: daysAgo(10) },
  { id: "c6", name: "Rafael Costa", phone: "33996789012", birthday: null, accepts_whatsapp: true, created_at: daysAgo(7), updated_at: daysAgo(7) },
  { id: "c7", name: "Juliana Ferreira", phone: "33997890123", birthday: "1988-12-25", accepts_whatsapp: true, created_at: daysAgo(5), updated_at: daysAgo(5) },
  { id: "c8", name: "Fernando Alves", phone: "33998901234", birthday: "1995-01-30", accepts_whatsapp: true, created_at: daysAgo(3), updated_at: daysAgo(3) },
  { id: "c9", name: "Isabela Rocha", phone: "33999012345", birthday: null, accepts_whatsapp: false, created_at: daysAgo(2), updated_at: daysAgo(2) },
  { id: "c10", name: "Gustavo Lima", phone: "33990123456", birthday: "1993-07-04", accepts_whatsapp: true, created_at: daysAgo(1), updated_at: daysAgo(1) },
];

interface MockReview {
  id: string;
  customer_id: string;
  pizza_rating: number;
  service_rating: number;
  ambiance_rating: number;
  comment: string | null;
  visit_type: "dine_in" | "delivery";
  created_at: string;
}

const SEED_REVIEWS: MockReview[] = [
  { id: "r1", customer_id: "c1", pizza_rating: 5, service_rating: 5, ambiance_rating: 5, comment: "Melhor pizza que ja comi em Valadares! Massa perfeita.", visit_type: "dine_in", created_at: daysAgo(20) },
  { id: "r2", customer_id: "c2", pizza_rating: 4, service_rating: 5, ambiance_rating: 4, comment: "Atendimento excelente, voltarei com certeza.", visit_type: "dine_in", created_at: daysAgo(18) },
  { id: "r3", customer_id: "c3", pizza_rating: 5, service_rating: 4, ambiance_rating: 5, comment: null, visit_type: "delivery", created_at: daysAgo(15) },
  { id: "r4", customer_id: "c4", pizza_rating: 3, service_rating: 3, ambiance_rating: 4, comment: "Pizza boa mas demorou bastante pra chegar.", visit_type: "delivery", created_at: daysAgo(12) },
  { id: "r5", customer_id: "c5", pizza_rating: 5, service_rating: 5, ambiance_rating: 5, comment: "Experiencia incrivel! Ambiente lindo e pizza maravilhosa.", visit_type: "dine_in", created_at: daysAgo(10) },
  { id: "r6", customer_id: "c6", pizza_rating: 4, service_rating: 4, ambiance_rating: 4, comment: "Muito bom, recomendo a Queridinha!", visit_type: "dine_in", created_at: daysAgo(7) },
  { id: "r7", customer_id: "c7", pizza_rating: 2, service_rating: 2, ambiance_rating: 3, comment: "Garcom demorou pra atender e pizza veio fria.", visit_type: "dine_in", created_at: daysAgo(5) },
  { id: "r8", customer_id: "c8", pizza_rating: 5, service_rating: 4, ambiance_rating: 5, comment: "Massa de fermentacao longa faz toda diferenca!", visit_type: "dine_in", created_at: daysAgo(3) },
  { id: "r9", customer_id: "c9", pizza_rating: 4, service_rating: 5, ambiance_rating: 4, comment: null, visit_type: "dine_in", created_at: daysAgo(2) },
  { id: "r10", customer_id: "c10", pizza_rating: 5, service_rating: 5, ambiance_rating: 5, comment: "Top 50 da America Latina merecidissimo!", visit_type: "dine_in", created_at: daysAgo(1) },
];

const SEED_PRIZES: (Prize & { _order: number })[] = [
  { id: "p1", name: "10% OFF", description: "10% de desconto na proxima visita", probability: 30, is_active: true, created_at: daysAgo(30), _order: 1 },
  { id: "p2", name: "Sobremesa Gratis", description: "Uma sobremesa por nossa conta na proxima visita", probability: 15, is_active: true, created_at: daysAgo(30), _order: 2 },
  { id: "p3", name: "Entrada Gratis", description: "Um petisco gratis na proxima visita", probability: 10, is_active: true, created_at: daysAgo(30), _order: 3 },
  { id: "p4", name: "15% OFF", description: "15% de desconto na proxima visita", probability: 8, is_active: true, created_at: daysAgo(30), _order: 4 },
  { id: "p5", name: "Bebida Cortesia", description: "Uma bebida por nossa conta na proxima visita", probability: 7, is_active: true, created_at: daysAgo(30), _order: 5 },
  { id: "p6", name: "Quase!", description: "Nao foi dessa vez... Mas use QUINTAL5 para 5% off!", probability: 25, is_active: true, created_at: daysAgo(30), _order: 6 },
  { id: "p7", name: "Pizza Gratis", description: "Uma pizza de 4 fatias por nossa conta!", probability: 3, is_active: true, created_at: daysAgo(30), _order: 7 },
  { id: "p8", name: "Aniversariante VIP", description: "Desconto especial de aniversario!", probability: 2, is_active: true, created_at: daysAgo(30), _order: 8 },
];

interface MockCoupon {
  id: string;
  customer_id: string;
  review_id: string;
  prize_id: string;
  code: string;
  redeemed: boolean;
  redeemed_at: string | null;
  expires_at: string;
  created_at: string;
}

const SEED_COUPONS: MockCoupon[] = [
  { id: "cp1", customer_id: "c1", review_id: "r1", prize_id: "p2", code: "Q333-AX7K2", redeemed: true, redeemed_at: daysAgo(15), expires_at: daysAgo(-10), created_at: daysAgo(20) },
  { id: "cp2", customer_id: "c2", review_id: "r2", prize_id: "p1", code: "Q333-BN4M8", redeemed: false, redeemed_at: null, expires_at: daysAgo(-12), created_at: daysAgo(18) },
  { id: "cp3", customer_id: "c3", review_id: "r3", prize_id: "p6", code: "Q333-CP9W3", redeemed: false, redeemed_at: null, expires_at: daysAgo(-15), created_at: daysAgo(15) },
  { id: "cp4", customer_id: "c4", review_id: "r4", prize_id: "p1", code: "Q333-DH6T5", redeemed: false, redeemed_at: null, expires_at: daysAgo(-18), created_at: daysAgo(12) },
  { id: "cp5", customer_id: "c5", review_id: "r5", prize_id: "p7", code: "Q333-EJ2R9", redeemed: true, redeemed_at: daysAgo(5), expires_at: daysAgo(-20), created_at: daysAgo(10) },
  { id: "cp6", customer_id: "c6", review_id: "r6", prize_id: "p5", code: "Q333-FK8L4", redeemed: false, redeemed_at: null, expires_at: daysAgo(-23), created_at: daysAgo(7) },
  { id: "cp7", customer_id: "c7", review_id: "r7", prize_id: "p6", code: "Q333-GM3P7", redeemed: false, redeemed_at: null, expires_at: daysAgo(-25), created_at: daysAgo(5) },
  { id: "cp8", customer_id: "c8", review_id: "r8", prize_id: "p3", code: "Q333-HN5Q1", redeemed: false, redeemed_at: null, expires_at: daysAgo(-27), created_at: daysAgo(3) },
];

// --- In-memory mutable store ---
export const store = {
  customers: [...SEED_CUSTOMERS],
  reviews: [...SEED_REVIEWS],
  prizes: SEED_PRIZES.map(({ _order: _, ...p }) => p) as Prize[],
  coupons: [...SEED_COUPONS],
  uid,
};
