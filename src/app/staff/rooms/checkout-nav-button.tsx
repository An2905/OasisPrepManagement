"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CheckoutNavButton({
  roomId,
  disabled,
}: {
  roomId: string;
  disabled: boolean;
}) {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant={disabled ? "secondary" : "primary"}
      disabled={disabled}
      onClick={() => router.push(`/staff/checkout/${encodeURIComponent(roomId)}`)}
    >
      Checkout
    </Button>
  );
}

