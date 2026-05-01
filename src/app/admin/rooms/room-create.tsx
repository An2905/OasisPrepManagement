"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { RoomStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { manualRoomStatusOptions } from "@/lib/room-status";

export function RoomCreateInline({
  roomClasses,
}: {
  roomClasses: Array<{ id: string; name: string; location: string }>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [location, setLocation] = useState("");
  const [points, setPoints] = useState("1");
  const [status, setStatus] = useState<RoomStatus>("Ready");
  const [roomClassId, setRoomClassId] = useState(roomClasses[0]?.id ?? "");
  const [loading, setLoading] = useState(false);

  const canSave = useMemo(() => {
    const p = Number.parseInt(points, 10);
    return (
      roomId.trim() &&
      location.trim() &&
      roomClassId.trim() &&
      Number.isFinite(p) &&
      p >= 0
    );
  }, [roomId, location, roomClassId, points]);

  async function onCreate() {
    const p = Number.parseInt(points, 10);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rooms/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roomId, location, roomClassId, points: p, status }),
      });
      if (res.ok) {
        setRoomId("");
        setLocation("");
        setPoints("1");
        setStatus("Ready");
        setOpen(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium text-zinc-900">Thêm phòng</div>
        <Button variant="secondary" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? "Đóng" : "+ Thêm"}
        </Button>
      </div>
      {open ? (
        <div className="grid gap-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-600">Room ID</span>
              <Input
                placeholder="vd: A-103"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-600">Khu / vị trí</span>
              <Input
                placeholder="vd: Khu A"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </label>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-600">Điểm phòng</span>
              <Input
                inputMode="numeric"
                placeholder="1"
                title="Điểm dùng cân bằng phân công checkout"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="max-w-[8rem]"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-600">Hạng phòng</span>
              <select
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300"
                value={roomClassId}
                onChange={(e) => setRoomClassId(e.target.value)}
              >
                {roomClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.location})
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-600">Trạng thái ban đầu</span>
              <select
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300"
                value={status}
                onChange={(e) => setStatus(e.target.value as RoomStatus)}
              >
                {manualRoomStatusOptions().map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="text-[11px] leading-snug text-zinc-500">
                Mặc định «Sẵn sàng». Check-in là thủ công: đặt «Có khách» lúc tạo hoặc trong Sửa phòng trước khi checkout.
              </span>
            </label>
          </div>
          <div>
            <Button onClick={onCreate} disabled={!canSave || loading}>
              {loading ? "Đang thêm..." : "Lưu"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

