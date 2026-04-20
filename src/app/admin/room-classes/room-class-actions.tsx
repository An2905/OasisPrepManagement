"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function RoomClassActions({
  id,
  name: initialName,
  location: initialLocation,
  checklist: initialChecklist,
  canDelete,
}: {
  id: string;
  name: string;
  location: string;
  checklist: string[];
  canDelete: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [location, setLocation] = useState(initialLocation);
  const [checklistText, setChecklistText] = useState(initialChecklist.join("\n"));
  const [loading, setLoading] = useState(false);

  const checklist = useMemo(
    () =>
      checklistText
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
    [checklistText],
  );

  async function onSave() {
    setLoading(true);
    try {
      await fetch("/api/admin/room-classes/update", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, location, checklist }),
      });
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!confirm("Xoá hạng phòng này?")) return;
    setLoading(true);
    try {
      await fetch("/api/admin/room-classes/delete", {
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
    <div className="grid justify-items-end gap-2">
      <div className="inline-flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? "Đóng" : "Sửa"}
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={onDelete}
          disabled={!canDelete || loading}
          title={canDelete ? "" : "Không thể xoá khi còn phòng"}
        >
          Xoá
        </Button>
      </div>
      {open ? (
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-3">
          <div className="grid gap-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Textarea
              value={checklistText}
              onChange={(e) => setChecklistText(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={onSave} disabled={loading || !name.trim() || !location.trim() || checklist.length === 0}>
                {loading ? "..." : "Lưu"}
              </Button>
              <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
                Huỷ
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

