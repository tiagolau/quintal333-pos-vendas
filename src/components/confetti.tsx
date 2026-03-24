"use client";

import { useEffect, useState } from "react";

const COLORS = ["#c9a84c", "#dfc06e", "#c0392b", "#27ae60", "#f5f0e8"];

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
}

export function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 2,
        size: Math.random() * 8 + 4,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
            animation: `confetti-fall ${2 + Math.random() * 2}s linear ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
