import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function diffMinutes(start?: Date | null, end?: Date | null) {
  if (!start || !end) return null;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
}

export default async function StaffHistoryPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const history = await prisma.checkOutTask.findMany({
    where: { assignedToId: user.id, status: "Completed" },
    orderBy: { completedAt: "desc" },
    take: 50,
    include: { room: true, checklistResults: true },
  });

  return (
    <Card>
      <CardHeader
        title="Lịch sử checkout"
        subtitle="Các lượt checkout đã hoàn thành gần đây."
      />
      <CardBody>
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium text-zinc-600">
              <tr>
                <th className="px-4 py-3">Phòng</th>
                <th className="px-4 py-3">Hoàn thành</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Issue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {history.map((h) => {
                const minutes = diffMinutes(h.startedAt, h.completedAt);
                const issue = (h.notes?.trim?.() ?? "") !== "" || h.checklistResults.some((x) => !x.ok);
                return (
                <tr key={h.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {h.room.roomId}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {h.completedAt ? new Date(h.completedAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {minutes === null ? "—" : `${minutes} phút`}
                  </td>
                  <td className="px-4 py-3">
                    {issue ? (
                      <Badge variant="amber">Có</Badge>
                    ) : (
                      <Badge variant="green">Không</Badge>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        {history.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
            Chưa có lịch sử.
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

