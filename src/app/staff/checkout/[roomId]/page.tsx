"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const classChecklist: Record<string, string[]> = {
  Deluxe: ["Remote TV", "Khăn tắm", "Dép", "Minibar", "Máy sấy tóc"],
  Premium: ["Remote TV", "Khăn tắm", "Dép", "Minibar", "Két sắt", "Áo choàng"],
  Villa: ["Remote TV", "Khăn tắm", "Dép", "Minibar", "Bếp", "Bồn tắm", "Loa"],
};

export default function StaffCheckoutRoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const roomId = decodeURIComponent(params.roomId);

  const room = useMemo(
    () => ({
      roomId,
      className: roomId.startsWith("B-") ? "Premium" : "Deluxe",
      location: roomId.startsWith("B-") ? "Khu B" : "Khu A",
      status: "CheckOutProcessing" as const,
      assignedTo: "Nguyễn Văn An",
    }),
    [roomId],
  );

  const checklist = classChecklist[room.className] ?? [];
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(checklist.map((x) => [x, false])),
  );
  const [notes, setNotes] = useState("");
  const [signature, setSignature] = useState(room.assignedTo);
  const [done, setDone] = useState(false);

  const allOk = checklist.length > 0 && checklist.every((x) => checked[x]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader
          title={`Checkout phòng ${room.roomId}`}
          subtitle="Tick OK cho đồ có đủ; nếu thiếu/hư thì ghi chú. Khi hoàn thành cần ký xác nhận (tên nhân viên)."
          right={
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Badge variant="amber">{room.status}</Badge>
              <Badge variant="neutral">{room.className}</Badge>
              <Badge variant="neutral">{room.location}</Badge>
            </div>
          }
        />
        <CardBody>
          {done ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-sm font-semibold text-emerald-800">
                Đã xác nhận hoàn thành checkout
              </div>
              <div className="mt-1 text-sm text-emerald-700">
                Ký tên: <span className="font-medium">{signature}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/staff/rooms">
                  <Button variant="secondary">Quay lại danh sách phòng</Button>
                </Link>
                <Button>In biên bản (demo)</Button>
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
                      {checklist.length} mục theo hạng phòng.
                    </div>
                  </div>
                  <Badge variant={allOk ? "green" : "neutral"}>
                    {allOk ? "All OK" : "Chưa đủ"}
                  </Badge>
                </div>

                <div className="mt-4 grid gap-2">
                  {checklist.map((item) => (
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
                          Nếu thiếu/hư: ghi vào phần ghi chú bên dưới.
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
                <div className="text-xs text-zinc-600">
                  Tip: nếu có issue, backend sẽ lưu để admin xem thống kê.
                </div>
              </div>

              <div className="grid gap-2">
                <div className="text-sm font-semibold text-zinc-900">
                  Ký xác nhận
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <Input
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder="Tên nhân viên"
                    />
                  </div>
                  <Button
                    className="sm:col-span-1"
                    onClick={() => setDone(true)}
                    disabled={!signature.trim()}
                  >
                    Xác nhận hoàn thành
                  </Button>
                </div>
                <div className="text-xs text-zinc-600">
                  Khi nối backend: sẽ tự lấy tên từ tài khoản đăng nhập (không cho sửa).
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="text-sm text-zinc-600">
        <Link className="font-medium text-zinc-900 hover:underline" href="/staff/rooms">
          ← Quay lại
        </Link>
      </div>
    </div>
  );
}

