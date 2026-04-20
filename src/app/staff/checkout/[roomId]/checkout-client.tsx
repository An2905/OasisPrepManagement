"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export type CheckoutClientData = {
  roomId: string;
  className: string;
  location: string;
  status: "CheckOutProcessing";
  assigneeName: string;
  checklist: string[];
};

export function CheckoutClient({ data }: { data: CheckoutClientData }) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(data.checklist.map((x) => [x, false])),
  );
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allOk = useMemo(
    () => data.checklist.length > 0 && data.checklist.every((x) => checked[x]),
    [checked, data.checklist],
  );

  async function onComplete() {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/staff/checkout/complete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          roomId: data.roomId,
          notes,
          items: data.checklist.map((label) => ({ label, ok: !!checked[label] })),
        }),
      });
      const json = (await res.json().catch(() => null)) as
        | { ok: true }
        | { ok: false; error?: string }
        | null;

      if (!res.ok || !json || json.ok !== true) {
        setError(json && "error" in json ? json.error ?? "Lỗi lưu checkout." : "Lỗi lưu checkout.");
        return;
      }
      setDone(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader
          title={`Checkout phòng ${data.roomId}`}
          subtitle={`Nhân viên: ${data.assigneeName}`}
          right={
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Badge variant="amber">{data.status}</Badge>
              <Badge variant="neutral">{data.className}</Badge>
              <Badge variant="neutral">{data.location}</Badge>
            </div>
          }
        />
        <CardBody>
          {done ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-sm font-semibold text-emerald-800">
                Hoàn thành checkout
              </div>
              <div className="mt-1 text-sm text-emerald-700">
                Phòng đã chuyển về trạng thái <span className="font-medium">Ready</span>.
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/staff/rooms">
                  <Button variant="secondary">Quay lại danh sách phòng</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-5">
              <div className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">
                      Checklist
                    </div>
                    <div className="mt-1 text-sm text-zinc-600">
                      {data.checklist.length} mục theo hạng phòng.
                    </div>
                  </div>
                  <Badge variant={allOk ? "green" : "neutral"}>
                    {allOk ? "All OK" : "Chưa đủ"}
                  </Badge>
                </div>

                <div className="mt-4 grid gap-2">
                  {data.checklist.map((item) => (
                    <label
                      key={item}
                      className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3 hover:bg-zinc-50"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-zinc-300"
                        checked={checked[item] ?? false}
                        onChange={(e) =>
                          setChecked((prev) => ({
                            ...prev,
                            [item]: e.target.checked,
                          }))
                        }
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-zinc-900">
                          {item}
                        </div>
                        <div className="text-xs text-zinc-600">
                          Nếu thiếu/hư: ghi vào phần ghi chú.
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <div className="text-sm font-semibold text-zinc-900">Ghi chú</div>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="vd: Thiếu 1 khăn tắm, remote TV hết pin..."
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button onClick={onComplete} disabled={saving}>
                  {saving ? "Đang lưu..." : "Xác nhận hoàn thành"}
                </Button>
                <Link href="/staff/rooms">
                  <Button variant="secondary" disabled={saving}>
                    Huỷ
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

