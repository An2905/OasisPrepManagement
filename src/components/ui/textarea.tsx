import type React from "react";

export function Textarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={[
        "min-h-24 w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900",
        "placeholder:text-zinc-400",
        "focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

