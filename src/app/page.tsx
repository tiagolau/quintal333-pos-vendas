"use client";

import { useState } from "react";
import type { FlowState, Prize } from "@/lib/types";
import { RatingStep } from "./steps/rating";
import { RegisterStep } from "./steps/register";
import { RouletteStep } from "./steps/roulette";
import { ResultStep } from "./steps/result";

const initialState: FlowState = {
  step: "rating",
  ratings: { pizza: 0, service: 0, ambiance: 0, comment: "" },
  customer: { name: "", phone: "", birthday: "", accepts_whatsapp: true },
  result: null,
};

export default function Home() {
  const [state, setState] = useState<FlowState>(initialState);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const updateRatings = (ratings: FlowState["ratings"]) => {
    setState((s) => ({ ...s, ratings }));
  };

  const updateCustomer = (customer: FlowState["customer"]) => {
    setState((s) => ({ ...s, customer }));
  };

  const goToRegister = () => {
    setState((s) => ({ ...s, step: "register" }));
  };

  const handleRegisterComplete = (cId: string, rId: string) => {
    setCustomerId(cId);
    setReviewId(rId);
    setState((s) => ({ ...s, step: "roulette" }));
  };

  const handleSpinComplete = (
    prize: Prize,
    couponCode: string,
    expiresAt: string
  ) => {
    setState((s) => ({
      ...s,
      step: "result",
      result: { prize, coupon_code: couponCode, expires_at: expiresAt },
    }));
  };

  const handleRestart = () => {
    setState(initialState);
    setReviewId(null);
    setCustomerId(null);
  };

  return (
    <main className="flex flex-col flex-1 items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-q-gold tracking-tight">
            QUINTAL 333
          </h1>
          <div className="w-16 h-0.5 bg-q-gold mx-auto mt-2" />
        </div>

        {/* Steps */}
        <div className="animate-fade-in-up">
          {state.step === "rating" && (
            <RatingStep
              ratings={state.ratings}
              onChange={updateRatings}
              onNext={goToRegister}
            />
          )}
          {state.step === "register" && (
            <RegisterStep
              customer={state.customer}
              ratings={state.ratings}
              onChange={updateCustomer}
              onComplete={handleRegisterComplete}
            />
          )}
          {state.step === "roulette" && (
            <RouletteStep
              customerId={customerId!}
              reviewId={reviewId!}
              onSpinComplete={handleSpinComplete}
            />
          )}
          {state.step === "result" && (
            <ResultStep result={state.result!} onRestart={handleRestart} />
          )}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {(["rating", "register", "roulette", "result"] as const).map(
            (step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  state.step === step ? "bg-q-gold" : "bg-q-gray/30"
                }`}
              />
            )
          )}
        </div>
      </div>
    </main>
  );
}
