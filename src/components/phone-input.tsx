"use client";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PhoneInput({ value, onChange }: PhoneInputProps) {
  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7)
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    onChange(raw);
  };

  return (
    <input
      type="tel"
      inputMode="numeric"
      value={formatPhone(value)}
      onChange={handleChange}
      placeholder="(33) 99191-9770"
      className="w-full px-4 py-3 rounded-lg bg-q-charcoal border border-q-gray/30 text-q-cream placeholder-q-gray/50 focus:outline-none focus:border-q-gold transition-colors"
    />
  );
}
