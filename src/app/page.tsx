"use client";

import { useState } from "react";
import type { FlowState, Prize } from "@/lib/types";
import { RatingStep } from "./steps/rating";
import { RegisterStep, type SubmitResult } from "./steps/register";
import { RouletteStep } from "./steps/roulette";
import { ResultStep } from "./steps/result";
import Image from "next/image";
import { ChapterIndicator } from "@/components/chapter-indicator";

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

  const handleRegisterComplete = (data: SubmitResult) => {
    setCustomerId(data.customerId);
    setReviewId(data.reviewId);
    if (data.existingCoupon) {
      // Cliente ja participou nos ultimos 90 dias — mostra o cupom ativo dele
      // em vez de deixar girar a roleta de novo. Avaliacao foi salva normal.
      setState((s) => ({
        ...s,
        step: "result",
        result: {
          prize: data.existingCoupon!.prize,
          coupon_code: data.existingCoupon!.code,
          expires_at: data.existingCoupon!.expires_at,
          isExisting: true,
        },
      }));
    } else {
      setState((s) => ({ ...s, step: "roulette" }));
    }
  };

  const handleSpinComplete = (
    prize: Prize,
    couponCode: string,
    expiresAt: string,
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
    <main className="flex flex-col flex-1 min-h-screen px-5 py-10 sm:px-8 sm:py-14">
      <div className="w-full max-w-[28rem] mx-auto flex flex-col flex-1">
        <header className="text-center mb-12 sm:mb-16">
          <p
            className="font-serif italic text-q-cream-soft text-[0.7rem] smallcaps mb-3"
            style={{ letterSpacing: "0.18em" }}
          >
            Pizzaria
          </p>
          <Image
            src="/logo.jpeg"
            alt="Quintal 333"
            width={225}
            height={225}
            priority
            className="mx-auto w-32 sm:w-36 h-auto"
            style={{ filter: "invert(1)", mixBlendMode: "screen" }}
          />
          <div
            className="mx-auto mt-3 h-px w-10 bg-q-gold-deep origin-center animate-reveal-line"
            aria-hidden="true"
          />
        </header>

        <div
          key={state.step}
          className="flex-1 animate-fade-up"
        >
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

        <footer className="mt-12 sm:mt-16">
          <ChapterIndicator current={state.step} />
        </footer>
      </div>
    </main>
  );
}
