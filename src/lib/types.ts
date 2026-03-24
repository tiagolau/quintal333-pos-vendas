export interface Customer {
  id: string;
  name: string;
  phone: string;
  birthday: string | null;
  accepts_whatsapp: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  customer_id: string;
  pizza_rating: number;
  service_rating: number;
  ambiance_rating: number;
  comment: string | null;
  visit_type: "dine_in" | "delivery";
  created_at: string;
}

export interface Prize {
  id: string;
  name: string;
  description: string;
  probability: number;
  is_active: boolean;
  created_at: string;
}

export interface Coupon {
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

export interface ReviewWithCustomer extends Review {
  customer: Pick<Customer, "name" | "phone">;
}

export interface CouponWithDetails extends Coupon {
  customer: Pick<Customer, "name" | "phone">;
  prize: Pick<Prize, "name" | "description">;
}

export interface DashboardStats {
  total_reviews: number;
  avg_pizza: number;
  avg_service: number;
  avg_ambiance: number;
  total_customers: number;
  new_customers_week: number;
  coupons_issued: number;
  coupons_redeemed: number;
}

export interface FlowState {
  step: "rating" | "register" | "roulette" | "result";
  ratings: {
    pizza: number;
    service: number;
    ambiance: number;
    comment: string;
  };
  customer: {
    name: string;
    phone: string;
    birthday: string;
    accepts_whatsapp: boolean;
  };
  result: {
    prize: Prize | null;
    coupon_code: string;
    expires_at: string;
  } | null;
}
