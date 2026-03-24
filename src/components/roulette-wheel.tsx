"use client";

import { useState, useCallback } from "react";
import type { Prize } from "@/lib/types";

interface RouletteWheelProps {
  prizes: Prize[];
  onSpinComplete: (prize: Prize) => void;
  disabled?: boolean;
}

const SEGMENT_COLORS = [
  "#c9a84c",
  "#2d2d2d",
  "#c0392b",
  "#1a1a1a",
  "#27ae60",
  "#2d2d2d",
  "#dfc06e",
  "#1a1a1a",
];

export function RouletteWheel({
  prizes,
  onSpinComplete,
  disabled,
}: RouletteWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const selectPrize = useCallback((): Prize => {
    const totalWeight = prizes.reduce((sum, p) => sum + p.probability, 0);
    let random = Math.random() * totalWeight;
    for (const prize of prizes) {
      random -= prize.probability;
      if (random <= 0) return prize;
    }
    return prizes[prizes.length - 1];
  }, [prizes]);

  const spin = useCallback(() => {
    if (spinning || disabled) return;
    setSpinning(true);

    const selectedPrize = selectPrize();
    const prizeIndex = prizes.findIndex((p) => p.id === selectedPrize.id);
    const segmentAngle = 360 / prizes.length;
    const targetAngle = 360 - prizeIndex * segmentAngle - segmentAngle / 2;
    const totalRotation = 360 * 5 + targetAngle;

    setRotation((prev) => prev + totalRotation);

    setTimeout(() => {
      setSpinning(false);
      onSpinComplete(selectedPrize);
    }, 4000);
  }, [spinning, disabled, prizes, selectPrize, onSpinComplete]);

  const segmentAngle = 360 / prizes.length;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-72 h-72 sm:w-80 sm:h-80">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-q-gold drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none",
          }}
        >
          {prizes.map((prize, i) => {
            const startAngle = (i * segmentAngle * Math.PI) / 180;
            const endAngle = ((i + 1) * segmentAngle * Math.PI) / 180;
            const x1 = 150 + 145 * Math.cos(startAngle);
            const y1 = 150 + 145 * Math.sin(startAngle);
            const x2 = 150 + 145 * Math.cos(endAngle);
            const y2 = 150 + 145 * Math.sin(endAngle);
            const largeArc = segmentAngle > 180 ? 1 : 0;

            const midAngle = ((i + 0.5) * segmentAngle * Math.PI) / 180;
            const textX = 150 + 90 * Math.cos(midAngle);
            const textY = 150 + 90 * Math.sin(midAngle);
            const textRotation = (i + 0.5) * segmentAngle;

            return (
              <g key={prize.id}>
                <path
                  d={`M150,150 L${x1},${y1} A145,145 0 ${largeArc},1 ${x2},${y2} Z`}
                  fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                  stroke="#f5f0e8"
                  strokeWidth="1"
                />
                <text
                  x={textX}
                  y={textY}
                  fill="#f5f0e8"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                >
                  {prize.name.length > 12
                    ? prize.name.slice(0, 12) + "..."
                    : prize.name}
                </text>
              </g>
            );
          })}
          {/* Center circle */}
          <circle cx="150" cy="150" r="20" fill="#1a1a1a" stroke="#c9a84c" strokeWidth="3" />
          <text x="150" y="150" fill="#c9a84c" fontSize="8" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
            333
          </text>
        </svg>
      </div>

      <button
        onClick={spin}
        disabled={spinning || disabled}
        className={`
          px-8 py-4 rounded-full text-lg font-bold uppercase tracking-wider
          transition-all duration-300
          ${
            spinning || disabled
              ? "bg-q-gray/30 text-q-gray cursor-not-allowed"
              : "bg-q-gold text-q-black hover:bg-q-gold-light active:scale-95 animate-pulse-gold"
          }
        `}
      >
        {spinning ? "Girando..." : "Girar Roleta!"}
      </button>
    </div>
  );
}
