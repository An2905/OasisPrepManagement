"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function RoomClassCreateInline() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [checklistText, setChecklistText] = useState("");
  const [loading, setLoading] = useState(false);

  const checklist = useMemo(
    () =>
      checklistText
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
    [checklistText],
  );

  const canSave = useMemo(
    () => name.trim() && location.trim() && checklist.length > 0,
    [name, location, checklist.length],
  );

  async function onCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/room-classes/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, location, checklist }),
      });
      if (res.ok) {
        setName("");
        setLocation("");
        setChecklistText("");
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
        <div className="text-sm font-medium text-zinc-900">Tạo hạng phòng</div>
        <Button variant="secondary" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? "Đóng" : "+ Tạo"}
        </Button>
      </div>
      {open ? (
        <div className="grid gap-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <Input
              placeholder="Tên hạng (vd: Deluxe)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Khu (vd: Khu A)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <Textarea
            placeholder={"Checklist (mỗi dòng 1 mục)\nvd:\nRemote TV\nKhăn tắm\nDép"}
            value={checklistText}
            onChange={(e) => setChecklistText(e.target.value)}
          />
          <div>
            <Button onClick={onCreate} disabled={!canSave || loading}>
              {loading ? "Đang tạo..." : "Lưu"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

