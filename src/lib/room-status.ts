import type { RoomStatus } from "@prisma/client";

export const ROOM_STATUS_LABELS: Record<RoomStatus, string> = {
  Ready: "Sẵn sàng",
  CheckedIn: "Có khách",
  CheckOutProcessing: "Đang checkout",
};

const MANUAL_STATUSES = ["Ready", "CheckedIn"] as const satisfies readonly RoomStatus[];

export function isManualRoomStatus(value: string): value is "Ready" | "CheckedIn" {
  return value === "Ready" || value === "CheckedIn";
}

export function manualRoomStatusOptions(): { value: RoomStatus; label: string }[] {
  return MANUAL_STATUSES.map((value) => ({
    value,
    label: ROOM_STATUS_LABELS[value],
  }));
}
