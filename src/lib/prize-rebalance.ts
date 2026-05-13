// Reequilíbrio proporcional das probabilidades dos prêmios.
//
// Quando o usuário muda a probabilidade de um prêmio para X%, os outros são
// reescalonados para que o total continue exatamente 100 — distribuição
// proporcional ao valor atual de cada um (quem tinha mais perde/ganha mais).
//
// Algoritmo: Largest Remainder (Hare quota). Calcula valores ideais em
// ponto flutuante, faz floor em todos e distribui o restante (até somar 100)
// para os com maior parte fracionária. Garante:
//  - todos inteiros
//  - soma exatamente 100
//  - sem viés sistemático de arredondamento

interface PrizeForRebalance {
  id: string;
  probability: number;
}

export function rebalanceTo100<T extends PrizeForRebalance>(
  prizes: T[],
  targetId: string,
  targetValue: number,
): T[] {
  if (prizes.length === 0) return prizes;
  if (!prizes.some((p) => p.id === targetId)) return prizes;

  const clamped = Math.max(0, Math.min(100, Math.round(targetValue)));

  if (prizes.length === 1) {
    // Só ele — sempre 100
    return prizes.map((p) => ({ ...p, probability: 100 }));
  }

  const others = prizes.filter((p) => p.id !== targetId);
  const remaining = 100 - clamped;
  const othersTotal = others.reduce((s, p) => s + p.probability, 0);

  // Valor ideal (float) para cada outro prêmio
  const ideal = others.map((p) => ({
    id: p.id,
    raw:
      othersTotal === 0
        ? remaining / others.length // distribui igual quando todos estão em 0
        : (p.probability / othersTotal) * remaining,
  }));

  // Floor + parte fracionária
  const floored = ideal.map((x, i) => ({
    id: x.id,
    floor: Math.floor(x.raw),
    frac: x.raw - Math.floor(x.raw),
    originalIndex: i,
  }));

  const used = floored.reduce((s, x) => s + x.floor, 0);
  let leftover = remaining - used;

  // Distribui o restante 1 a 1 para os com maior fração (desempate: ordem original)
  const ordered = [...floored].sort(
    (a, b) => b.frac - a.frac || a.originalIndex - b.originalIndex,
  );
  for (let i = 0; i < ordered.length && leftover > 0; i++) {
    ordered[i].floor += 1;
    leftover--;
  }

  const newProb = new Map(ordered.map((x) => [x.id, x.floor]));

  return prizes.map((p) =>
    p.id === targetId
      ? { ...p, probability: clamped }
      : { ...p, probability: newProb.get(p.id) ?? p.probability },
  );
}

// Normaliza a lista para somar 100, usando o mesmo algoritmo, sem alvo.
// Útil após exclusão: o "buraco" deixado pelo deletado é absorvido pelos outros.
export function normalizeTo100<T extends PrizeForRebalance>(prizes: T[]): T[] {
  if (prizes.length === 0) return prizes;
  if (prizes.length === 1) return prizes.map((p) => ({ ...p, probability: 100 }));

  const total = prizes.reduce((s, p) => s + p.probability, 0);
  if (total === 100) return prizes;

  // Trata como se um "alvo invisível" de valor 0 estivesse fora — só normaliza.
  const ideal = prizes.map((p, i) => ({
    id: p.id,
    raw: total === 0 ? 100 / prizes.length : (p.probability / total) * 100,
    originalIndex: i,
  }));

  const floored = ideal.map((x) => ({
    id: x.id,
    floor: Math.floor(x.raw),
    frac: x.raw - Math.floor(x.raw),
    originalIndex: x.originalIndex,
  }));

  const used = floored.reduce((s, x) => s + x.floor, 0);
  let leftover = 100 - used;

  const ordered = [...floored].sort(
    (a, b) => b.frac - a.frac || a.originalIndex - b.originalIndex,
  );
  for (let i = 0; i < ordered.length && leftover > 0; i++) {
    ordered[i].floor += 1;
    leftover--;
  }

  const map = new Map(ordered.map((x) => [x.id, x.floor]));
  return prizes.map((p) => ({ ...p, probability: map.get(p.id) ?? p.probability }));
}
