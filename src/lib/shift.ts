import type { StaffShift } from "@prisma/client";

export const STAFF_SHIFT_LABELS: Record<StaffShift, string> = {
  Ca1: "Ca 1 (07:00–15:00)",
  Ca2: "Ca 2 (15:00–23:00)",
  Ca3: "Ca 3 (23:00–07:00)",
};

function hourInTimeZone(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hourCycle: "h23",
  });
  const hourPart = dtf.formatToParts(date).find((p) => p.type === "hour");
  return Number.parseInt(hourPart?.value ?? "0", 10);
}

/** Theo giờ Asia/Ho_Chi_Minh: Ca1 [07,15), Ca2 [15,23), Ca3 còn lại */
export function getCurrentStaffShift(
  now = new Date(),
  timeZone = "Asia/Ho_Chi_Minh",
): StaffShift {
  const hour = hourInTimeZone(now, timeZone);
  if (hour >= 7 && hour < 15) return "Ca1";
  if (hour >= 15 && hour < 23) return "Ca2";
  return "Ca3";
}

const SHIFT_VALUES = new Set<string>(["Ca1", "Ca2", "Ca3"]);

export function isStaffShift(value: string): value is StaffShift {
  return SHIFT_VALUES.has(value);
}

export function parseStaffShiftParam(value: unknown): StaffShift | "auto" {
  if (value === undefined || value === null || value === "") return "auto";
  if (value === "auto") return "auto";
  const s = String(value).trim();
  if (!SHIFT_VALUES.has(s)) return "auto";
  return s as StaffShift;
}

export function resolveStaffShiftForCheckout(bodyShift: unknown): StaffShift {
  const parsed = parseStaffShiftParam(bodyShift);
  if (parsed === "auto") return getCurrentStaffShift();
  return parsed;
}
