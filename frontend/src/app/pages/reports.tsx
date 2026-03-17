import { useState, useEffect } from 'react';
import { Flag, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { apiFetch } from '@/app/data/api';
import { toast } from 'sonner';

export function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchReports = () => {
    apiFetch('/api/reports')
      .then(data => setReports(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Không có quyền truy cập'));
  };

  useEffect(() => { fetchReports(); }, []);

  const handleUpdateStatus = async (reportId: number, status: string) => {
    try {
      await apiFetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      toast.success('Đã cập nhật trạng thái!');
      fetchReports();
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  const reasonLabel: Record<string, string> = {
    no_show: 'Không xuất hiện đúng giờ',
    poor_quality: 'Chất lượng dịch vụ kém',
    inappropriate: 'Hành vi không phù hợp',
    fraud: 'Gian lận / lừa đảo',
    other: 'Lý do khác',
  };

  const statusConfig: Record<string, { label: string; className: string; icon: JSX.Element }> = {
    pending: {
      label: 'Chờ xử lý',
      className: 'bg-yellow-100 text-yellow-700',
      icon: <AlertCircle className="h-4 w-4" />,
    },
    reviewed: {
      label: 'Đang xem xét',
      className: 'bg-blue-100 text-blue-700',
      icon: <Clock className="h-4 w-4" />,
    },
    resolved: {
      label: 'Đã giải quyết',
      className: 'bg-green-100 text-green-700',
      icon: <CheckCircle className="h-4 w-4" />,
    },
  };

  const filtered = filterStatus === 'all'
    ? reports
    : reports.filter(r => r.status === filterStatus);

  // Thống kê
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    reviewed: reports.filter(r => r.status === 'reviewed').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Flag className="h-8 w-8 text-red-500" />
            Quản lý Reports
          </h1>
          <p className="text-gray-600">Xem xét và xử lý các báo cáo từ người dùng</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Tổng cộng', value: stats.total, className: 'text-gray-700' },
            { label: 'Chờ xử lý', value: stats.pending, className: 'text-yellow-600' },
            { label: 'Đang xem xét', value: stats.reviewed, className: 'text-blue-600' },
            { label: 'Đã giải quyết', value: stats.resolved, className: 'text-green-600' },
          ].map(stat => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <p className={`text-3xl font-bold ${stat.className}`}>{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-gray-600 font-medium">Lọc theo:</span>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả ({stats.total})</SelectItem>
              <SelectItem value="pending">Chờ xử lý ({stats.pending})</SelectItem>
              <SelectItem value="reviewed">Đang xem xét ({stats.reviewed})</SelectItem>
              <SelectItem value="resolved">Đã giải quyết ({stats.resolved})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Report List */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Flag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có báo cáo nào</h3>
              <p className="text-gray-500">Chưa có report nào trong mục này</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map(report => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">

                  {/* Top row: ID + status badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">Report #{report.id}</span>
                    <Badge
                      variant="secondary"
                      className={`gap-1 ${statusConfig[report.status]?.className}`}
                    >
                      {statusConfig[report.status]?.icon}
                      {statusConfig[report.status]?.label}
                    </Badge>
                  </div>

                  {/* Service info */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-gray-700">
                      📋 {report.service_title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {report.service_category} · {report.booking_credits} credits · Booking #{report.booking_id}
                    </p>
                  </div>

                  {/* Reporter & Reported */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={report.reporter_avatar} />
                        <AvatarFallback>{report.reporter_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs text-gray-500">Người báo cáo</p>
                        <p className="font-medium text-sm">{report.reporter_name}</p>
                        <p className="text-xs text-gray-400">{report.reporter_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={report.reported_avatar} />
                        <AvatarFallback>{report.reported_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs text-gray-500">Người bị báo cáo</p>
                        <p className="font-medium text-sm">{report.reported_name}</p>
                        <p className="text-xs text-gray-400">{report.reported_email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Reason & Detail */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      🚩 Lý do: <span className="text-red-600">{reasonLabel[report.reason] || report.reason}</span>
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{report.detail}</p>
                    </div>
                  </div>

                  {/* Time & Actions */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {new Date(report.created_at).toLocaleString('vi-VN')}
                    </p>
                    <div className="flex gap-2">
                      {report.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleUpdateStatus(report.id, 'reviewed')}
                        >
                          <Clock className="h-4 w-4 mr-1" /> Đang xem xét
                        </Button>
                      )}
                      {report.status !== 'resolved' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleUpdateStatus(report.id, 'resolved')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Đã giải quyết
                        </Button>
                      )}
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}