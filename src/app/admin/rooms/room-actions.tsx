"use client";

import type { RoomStatus } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminRoomStatusSelectOptions } from "@/lib/room-status";

export function RoomActions({
  id,
  location: initialLocation,
  points: initialPoints,
  status: initialStatus,
  roomClassId: initialRoomClassId,
  roomClasses,
  canDelete,
}: {
  id: string;
  location: string;
  points: number;
  status: RoomStatus;
  roomClassId: string;
  roomClasses: Array<{ id: string; name: string; location: string }>;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(initialLocation);
  const [points, setPoints] = useState(String(initialPoints));
  const [status, setStatus] = useState<RoomStatus>(initialStatus);
  const [roomClassId, setRoomClassId] = useState(initialRoomClassId);
  const [loading, setLoading] = useState(false);

  async function onSave() {
    const p = Number.parseInt(points, 10);
    if (!Number.isFinite(p) || p < 0) return;
    setLoading(true);
    try {
      await fetch("/api/admin/rooms/update", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id,
          location,
          roomClassId,
          points: p,
          status,
        }),
      });
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!confirm("Xoá phòng này?")) return;
    setLoading(true);
    try {
      await fetch("/api/admin/rooms/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      {open ? (
        <>
          <Input className="h-9 w-32" value={location} onChange={(e) => setLocation(e.target.value)} />
          <Input
            className="h-9 w-16"
            inputMode="numeric"
            title="Điểm phòng"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
          <select
            className="h-9 rounded-xl border border-zinc-200 bg-white px-2 text-sm text-zinc-900"
            value={roomClassId}
            onChange={(e) => setRoomClassId(e.target.value)}
          >
            {roomClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="h-9 min-w-[10rem] rounded-xl border border-zinc-200 bg-white px-2 text-sm text-zinc-900"
            value={status}
            onChange={(e) => setStatus(e.target.value as RoomStatus)}
            aria-label="Trạng thái phòng"
            title={
              initialStatus !== "CheckOutProcessing"
                ? "Đặt «Có khách» trước khi dùng nút checkout"
                : "Chọn Sẵn sàng hoặc Có khách để huỷ checkout và huỷ task đang giao"
            }
          >
            {adminRoomStatusSelectOptions(initialStatus).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={onSave}
            disabled={
              loading ||
              !location.trim() ||
              !roomClassId.trim() ||
              !Number.isFinite(Number.parseInt(points, 10)) ||
              Number.parseInt(points, 10) < 0
            }
          >
            {loading ? "..." : "Lưu"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Huỷ
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLocation(initialLocation);
              setPoints(String(initialPoints));
              setStatus(initialStatus);
              setRoomClassId(initialRoomClassId);
              setOpen(true);
            }}
          >
            Sửa
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            disabled={!canDelete || loading}
            title={canDelete ? "" : "Không thể xoá khi đang có task"}
          >
            Xoá
          </Button>
        </>
      )}
    </div>
  );
}
