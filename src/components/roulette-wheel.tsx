"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import type { Prize } from "@/lib/types";

interface RouletteWheelProps {
  prizes: Prize[];
  onSpinComplete: (prize: Prize) => void;
  disabled?: boolean;
}

const SPIN_DURATION_MS = 4200;
const REDUCED_REVEAL_MS = 700;

const reducedMotionSubscribe = (callback: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};
const reducedMotionSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reducedMotionServerSnapshot = () => false;

export function RouletteWheel({
  prizes,
  onSpinComplete,
  disabled,
}: RouletteWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [revealing, setRevealing] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    reducedMotionSubscribe,
    reducedMotionSnapshot,
    reducedMotionServerSnapshot,
  );
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSettleTone = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.07);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // audio failure is acceptable; silent fallback
    }
  }, []);

  const selectPrize = useCallback((): number => {
    const totalWeight = prizes.reduce((s, p) => s + p.probability, 0);
    let r = Math.random() * totalWeight;
    for (let i = 0; i < prizes.length; i++) {
      r -= prizes[i].probability;
      if (r <= 0) return i;
    }
    return prizes.length - 1;
  }, [prizes]);

  const handleSpin = useCallback(() => {
    if (spinning || revealing || disabled || prizes.length === 0) return;

    const prizeIndex = selectPrize();
    setSpinning(true);
    setWinnerIndex(null);

    if (prefersReducedMotion) {
      setTimeout(() => {
        setRevealing(true);
        setWinnerIndex(prizeIndex);
        playSettleTone();
      }, 120);
      setTimeout(() => {
        setSpinning(false);
        setRevealing(false);
        onSpinComplete(prizes[prizeIndex]);
      }, REDUCED_REVEAL_MS + 120);
      return;
    }

    const segmentAngle = 360 / prizes.length;
    const targetCenter = prizeIndex * segmentAngle + segmentAngle / 2;
    const jitter = (Math.random() - 0.5) * segmentAngle * 0.45;
    const targetAngle = 360 - targetCenter - jitter;
    const totalRotation = 360 * 6 + targetAngle;

    setRotation((prev) => prev + totalRotation);

    setTimeout(() => {
      playSettleTone();
      setRevealing(true);
      setWinnerIndex(prizeIndex);
    }, SPIN_DURATION_MS);

    setTimeout(() => {
      setSpinning(false);
      setRevealing(false);
      onSpinComplete(prizes[prizeIndex]);
    }, SPIN_DURATION_MS + 900);
  }, [
    spinning,
    revealing,
    disabled,
    prizes,
    selectPrize,
    prefersReducedMotion,
    onSpinComplete,
    playSettleTone,
  ]);

  if (prizes.length === 0) return null;

  const segmentAngle = 360 / prizes.length;
  const VIEW = 320;
  const cx = VIEW / 2;
  const cy = VIEW / 2;
  const outerR = 150;
  const innerR = 28;
  const labelR = 100;

  const arcPath = (i: number) => {
    const start = (i * segmentAngle - 90) * (Math.PI / 180);
    const end = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
    const x1 = cx + outerR * Math.cos(start);
    const y1 = cy + outerR * Math.sin(start);
    const x2 = cx + outerR * Math.cos(end);
    const y2 = cy + outerR * Math.sin(end);
    const xi1 = cx + innerR * Math.cos(start);
    const yi1 = cy + innerR * Math.sin(start);
    const xi2 = cx + innerR * Math.cos(end);
    const yi2 = cy + innerR * Math.sin(end);
    const largeArc = segmentAngle > 180 ? 1 : 0;
    return [
      `M ${xi1} ${yi1}`,
      `L ${x1} ${y1}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${xi2} ${yi2}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${xi1} ${yi1}`,
      "Z",
    ].join(" ");
  };

  const truncateLabel = (name: string) => {
    const n = name.trim();
    if (n.length <= 16) return n;
    return n.slice(0, 15).trimEnd() + "…";
  };

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      <div
        className="relative w-[18rem] h-[18rem] sm:w-[20rem] sm:h-[20rem]"
        style={{ filter: "drop-shadow(0 18px 32px oklch(0 0 0 / 0.55))" }}
      >
        {/* Fixed pointer (outside, pointing down to top edge of wheel) */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
          style={{ transform: "translate(-50%, -55%)" }}
        >
          <svg
            viewBox="0 0 18 22"
            className="w-3 h-4"
            fill="var(--q-gold)"
            stroke="var(--q-gold-deep)"
            strokeWidth="0.4"
            strokeLinejoin="round"
          >
            <path d="M9 22 L0.5 4 Q9 0 17.5 4 Z" />
          </svg>
        </div>

        {/* Wheel */}
        <svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="w-full h-full"
          style={{
            transform: prefersReducedMotion
              ? "rotate(0deg)"
              : `rotate(${rotation}deg)`,
            transition: spinning && !prefersReducedMotion
              ? `transform ${SPIN_DURATION_MS}ms var(--ease-roulette)`
              : "none",
          }}
        >
          {/* Outermost double ring (coin edge) */}
          <circle
            cx={cx}
            cy={cy}
            r={outerR + 4}
            fill="none"
            stroke="var(--q-gold-deep)"
            strokeWidth="0.6"
          />
          <circle
            cx={cx}
            cy={cy}
            r={outerR + 1}
            fill="none"
            stroke="var(--q-gold)"
            strokeWidth="0.8"
          />

          {/* Segments */}
          {prizes.map((prize, i) => {
            const isWinner = winnerIndex === i;
            const otherWinner = winnerIndex !== null && !isWinner;
            return (
              <path
                key={prize.id}
                d={arcPath(i)}
                fill={i % 2 === 0 ? "var(--q-coal)" : "var(--q-charcoal)"}
                opacity={otherWinner ? 0.32 : isWinner ? 1 : 0.96}
                style={{
                  transition:
                    "opacity 600ms var(--ease-out-expo), fill 400ms ease-out",
                }}
              />
            );
          })}

          {/* Hairline gold dividers */}
          {prizes.map((_, i) => {
            const angle = (i * segmentAngle - 90) * (Math.PI / 180);
            const x1 = cx + innerR * Math.cos(angle);
            const y1 = cy + innerR * Math.sin(angle);
            const x2 = cx + outerR * Math.cos(angle);
            const y2 = cy + outerR * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--q-gold-deep)"
                strokeWidth="0.35"
                opacity={winnerIndex !== null ? 0.5 : 0.9}
                style={{ transition: "opacity 500ms ease-out" }}
              />
            );
          })}

          {/* Labels (radial) */}
          {prizes.map((prize, i) => {
            const midAngle = (i + 0.5) * segmentAngle - 90;
            const rad = (midAngle * Math.PI) / 180;
            const tx = cx + labelR * Math.cos(rad);
            const ty = cy + labelR * Math.sin(rad);
            const rot =
              midAngle > 0 && midAngle < 180 ? midAngle - 90 : midAngle + 90;
            const isWinner = winnerIndex === i;
            const otherWinner = winnerIndex !== null && !isWinner;
            return (
              <text
                key={prize.id}
                x={tx}
                y={ty}
                fill={isWinner ? "var(--q-gold)" : "var(--q-cream-soft)"}
                opacity={otherWinner ? 0.35 : 1}
                fontSize="8.5"
                fontFamily="var(--font-fraunces), Georgia, serif"
                fontStyle="italic"
                fontWeight="400"
                textAnchor="middle"
                dominantBaseline="middle"
                letterSpacing="0.12"
                transform={`rotate(${rot} ${tx} ${ty})`}
                style={{
                  transition:
                    "opacity 600ms var(--ease-out-expo), fill 400ms ease-out",
                }}
              >
                {truncateLabel(prize.name)}
              </text>
            );
          })}

        </svg>

        {/* Fixed hub overlay — does NOT rotate with the wheel */}
        <svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <circle
            cx={cx}
            cy={cy}
            r={innerR}
            fill="var(--q-black)"
            stroke="var(--q-gold)"
            strokeWidth="0.8"
          />
          <circle
            cx={cx}
            cy={cy}
            r={innerR - 5}
            fill="var(--q-gold)"
            stroke="var(--q-gold-deep)"
            strokeWidth="0.4"
          />
          <text
            x={cx}
            y={cy + 0.5}
            fill="var(--q-black)"
            fontSize="9"
            fontFamily="var(--font-fraunces), Georgia, serif"
            fontWeight="500"
            textAnchor="middle"
            dominantBaseline="middle"
            letterSpacing="0.18"
          >
            333
          </text>
        </svg>

        {/* Invisible center tap target — wheel IS the button */}
        <button
          type="button"
          onClick={handleSpin}
          disabled={spinning || revealing || disabled}
          aria-label={spinning ? "Girando" : "Tocar para girar a roleta"}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full disabled:cursor-default cursor-pointer z-10"
        />
      </div>

      <p
        className={`text-center font-serif italic text-q-cream-soft text-sm transition-opacity duration-500 ${
          spinning ? "opacity-30" : "opacity-100"
        }`}
        style={{ fontVariationSettings: '"opsz" 14, "SOFT" 60' }}
      >
        {spinning
          ? "girando"
          : revealing
            ? ""
            : "toque o disco para girar"}
      </p>
    </div>
  );
}
