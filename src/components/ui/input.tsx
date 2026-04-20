import type React from "react";

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        "h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900",
        "placeholder:text-zinc-400",
        "focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

