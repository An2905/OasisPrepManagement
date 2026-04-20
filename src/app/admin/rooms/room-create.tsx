"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RoomCreateInline({
  roomClasses,
}: {
  roomClasses: Array<{ id: string; name: string; location: string }>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [location, setLocation] = useState("");
  const [roomClassId, setRoomClassId] = useState(roomClasses[0]?.id ?? "");
  const [loading, setLoading] = useState(false);

  const canSave = useMemo(
    () => roomId.trim() && location.trim() && roomClassId.trim(),
    [roomId, location, roomClassId],
  );

  async function onCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rooms/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roomId, location, roomClassId }),
      });
      if (res.ok) {
        setRoomId("");
        setLocation("");
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
        <div className="grid gap-2 sm:grid-cols-3">
          <Input
            placeholder="RoomId (vd: A-103)"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <Input
            placeholder="Location (vd: Khu A)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
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
          <div className="sm:col-span-3">
            <Button onClick={onCreate} disabled={!canSave || loading}>
              {loading ? "Đang thêm..." : "Lưu"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

