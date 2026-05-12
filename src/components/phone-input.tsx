"use client";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export function PhoneInput({ value, onChange, id = "phone" }: PhoneInputProps) {
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
      id={id}
      type="tel"
      inputMode="numeric"
      autoComplete="tel-national"
      value={formatPhone(value)}
      onChange={handleChange}
      placeholder="(33) 99191-9770"
      className="w-full bg-transparent border-b border-q-stone/40 focus:border-q-gold transition-colors duration-300 text-q-cream placeholder:text-q-stone/55 placeholder:italic placeholder:font-serif placeholder:font-light py-2 px-0 focus:outline-none text-[1.05rem] nums-tabular"
    />
  );
}
