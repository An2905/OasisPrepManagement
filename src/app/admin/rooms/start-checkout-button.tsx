"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function StartCheckoutButton({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onStart() {
    setLoading(true);
    try {
      await fetch("/api/admin/rooms/start-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="sm" variant="secondary" onClick={onStart} disabled={loading}>
      {loading ? "Đang phân công..." : "Bắt đầu checkout"}
    </Button>
  );
}

