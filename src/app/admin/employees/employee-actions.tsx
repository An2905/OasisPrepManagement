"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateStaffInline() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const canSave = useMemo(
    () => username.trim() && displayName.trim() && password.length >= 4,
    [username, displayName, password],
  );

  async function onCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/staff/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, displayName, password }),
      });
      if (res.ok) {
        setUsername("");
        setDisplayName("");
        setPassword("");
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
        <div className="text-sm font-medium text-zinc-900">Tạo nhân viên</div>
        <Button variant="secondary" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? "Đóng" : "+ Tạo"}
        </Button>
      </div>
      {open ? (
        <div className="grid gap-2 sm:grid-cols-3">
          <Input
            placeholder="username (vd: nv02)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="tên hiển thị"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Input
            placeholder="mật khẩu (>=4 ký tự)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="sm:col-span-3">
            <Button onClick={onCreate} disabled={!canSave || loading}>
              {loading ? "Đang tạo..." : "Lưu"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ToggleActiveButton({
  userId,
  active,
}: {
  userId: string;
  active: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onToggle() {
    setLoading(true);
    try {
      await fetch("/api/admin/staff/toggle-active", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, active: !active }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={onToggle} disabled={loading}>
      {loading ? "..." : active ? "Tắt" : "Bật"}
    </Button>
  );
}

export function ResetPasswordInline({ userId }: { userId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onReset() {
    setLoading(true);
    try {
      await fetch("/api/admin/staff/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });
      setPassword("");
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      {open ? (
        <>
          <Input
            className="h-9 w-44"
            placeholder="mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button size="sm" onClick={onReset} disabled={password.length < 4 || loading}>
            {loading ? "..." : "OK"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Huỷ
          </Button>
        </>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          Reset mật khẩu
        </Button>
      )}
    </div>
  );
}

export function EditStaffInline({
  userId,
  username: initialUsername,
  displayName: initialDisplayName,
}: {
  userId: string;
  username: string;
  displayName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(initialUsername);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [loading, setLoading] = useState(false);

  async function onSave() {
    setLoading(true);
    try {
      await fetch("/api/admin/staff/update", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, username, displayName }),
      });
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      {open ? (
        <>
          <Input
            className="h-9 w-28"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            className="h-9 w-44"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Button
            size="sm"
            onClick={onSave}
            disabled={!username.trim() || !displayName.trim() || loading}
          >
            {loading ? "..." : "Lưu"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Huỷ
          </Button>
        </>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          Sửa
        </Button>
      )}
    </div>
  );
}

