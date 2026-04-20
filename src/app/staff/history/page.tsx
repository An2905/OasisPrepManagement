import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const history = [
  { roomId: "A-099", minutes: 14, date: "Hôm nay", issue: false },
  { roomId: "A-098", minutes: 22, date: "Hôm nay", issue: true },
  { roomId: "B-105", minutes: 18, date: "Hôm qua", issue: false },
];

export default function StaffHistoryPage() {
  return (
    <Card>
      <CardHeader
        title="Lịch sử checkout"
        subtitle="Bản demo: sẽ hiển thị theo tuần/tháng và lọc issue."
      />
      <CardBody>
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium text-zinc-600">
              <tr>
                <th className="px-4 py-3">Phòng</th>
                <th className="px-4 py-3">Ngày</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Issue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {history.map((h) => (
                <tr key={`${h.roomId}-${h.date}`} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {h.roomId}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{h.date}</td>
                  <td className="px-4 py-3 text-zinc-700">{h.minutes} phút</td>
                  <td className="px-4 py-3">
                    {h.issue ? (
                      <Badge variant="amber">Có</Badge>
                    ) : (
                      <Badge variant="green">Không</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}

