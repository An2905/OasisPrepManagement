"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type ShiftChoice = "auto" | "Ca1" | "Ca2" | "Ca3";

export function StartCheckoutButton({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shift, setShift] = useState<ShiftChoice>("auto");

  async function onStart() {
    setLoading(true);
    try {
      await fetch("/api/admin/rooms/start-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roomId, shift }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="h-9 rounded-xl border border-zinc-200 bg-white px-2 text-xs text-zinc-900"
        value={shift}
        onChange={(e) => setShift(e.target.value as ShiftChoice)}
        aria-label="Ca phân công"
      >
        <option value="auto">Ca theo giờ hiện tại</option>
        <option value="Ca1">Ca 1 (07–15)</option>
        <option value="Ca2">Ca 2 (15–23)</option>
        <option value="Ca3">Ca 3 (23–07)</option>
      </select>
      <Button size="sm" variant="secondary" onClick={onStart} disabled={loading}>
        {loading ? "Đang phân công..." : "Bắt đầu checkout"}
      </Button>
    </div>
  );
}
