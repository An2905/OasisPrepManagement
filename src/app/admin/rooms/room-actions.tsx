"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RoomActions({
  id,
  location: initialLocation,
  roomClassId: initialRoomClassId,
  roomClasses,
  canDelete,
}: {
  id: string;
  location: string;
  roomClassId: string;
  roomClasses: Array<{ id: string; name: string; location: string }>;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(initialLocation);
  const [roomClassId, setRoomClassId] = useState(initialRoomClassId);
  const [loading, setLoading] = useState(false);

  async function onSave() {
    setLoading(true);
    try {
      await fetch("/api/admin/rooms/update", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, location, roomClassId }),
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
          <Button size="sm" onClick={onSave} disabled={loading || !location.trim() || !roomClassId.trim()}>
            {loading ? "..." : "Lưu"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Huỷ
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
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

