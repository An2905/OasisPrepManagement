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

/** Dropdown admin: Ready/Có khách; thêm «Đang checkout» khi đang ở trạng thái đó để giữ hoặc thoát. */
export function adminRoomStatusSelectOptions(current: RoomStatus): { value: RoomStatus; label: string }[] {
  const base = manualRoomStatusOptions();
  if (current === "CheckOutProcessing") {
    return [...base, { value: "CheckOutProcessing", label: ROOM_STATUS_LABELS.CheckOutProcessing }];
  }
  return base;
}

export function validateAdminRoomStatusTransition(
  current: RoomStatus,
  requested: string,
): { ok: true; next: RoomStatus | null } | { ok: false; message: string } {
  const r = requested.trim();
  if (r !== "Ready" && r !== "CheckedIn" && r !== "CheckOutProcessing") {
    return { ok: false, message: "Trạng thái không hợp lệ." };
  }
  const req = r as RoomStatus;
  if (req === "CheckOutProcessing" && current !== "CheckOutProcessing") {
    return {
      ok: false,
      message:
        "Không đặt «Đang checkout» trực tiếp: đặt «Có khách» trước, rồi dùng nút «Bắt đầu checkout».",
    };
  }
  if (req === current) return { ok: true, next: null };
  return { ok: true, next: req };
}
