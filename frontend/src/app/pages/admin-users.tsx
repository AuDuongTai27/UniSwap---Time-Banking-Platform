import { useState, useEffect } from 'react';
import { Users, Search, Shield, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { apiFetch } from '@/app/data/api';
import { toast } from 'sonner';

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiFetch('/api/admin/users')
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Không có quyền truy cập'));
  }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Thống kê
  const stats = {
    total: users.length,
    verified: users.filter(u => u.is_verified).length,
    active: users.filter(u => u.total_reviews > 0).length,
    avgRating: users.length
      ? (users.reduce((sum, u) => sum + Number(u.rating), 0) / users.length).toFixed(2)
      : '0',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Quản lý người dùng
          </h1>
          <p className="text-gray-600">Danh sách tất cả người dùng trên hệ thống</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Tổng người dùng', value: stats.total, className: 'text-gray-700' },
            { label: 'Đã xác minh', value: stats.verified, className: 'text-green-600' },
            { label: 'Đã hoạt động', value: stats.active, className: 'text-blue-600' },
            { label: 'Rating TB', value: stats.avgRating, className: 'text-yellow-600' },
          ].map(stat => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <p className={`text-3xl font-bold ${stat.className}`}>{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* User List */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy người dùng</h3>
              <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-gray-600">
                {filtered.length} người dùng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filtered.map(user => (
                  <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">

                    {/* Avatar */}
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        {user.is_verified && (
                          <Shield className="h-4 w-4 text-blue-500" title="Đã xác minh" />
                        )}
                        <Badge
                          variant="secondary"
                          className={user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-600'}
                        >
                          {user.role === 'admin' ? 'Admin' : 'Client'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      {user.status && (
                        <p className="text-xs text-gray-400 truncate">{user.status}</p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                          <Star className="h-4 w-4 fill-yellow-400" />
                          {Number(user.rating).toFixed(1)}
                        </div>
                        <p className="text-xs text-gray-400">{user.total_reviews} reviews</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-blue-600 font-semibold">
                          <Clock className="h-4 w-4" />
                          {(Number(user.credits_earned) - Number(user.credits_spent)).toFixed(1)}
                        </div>
                        <p className="text-xs text-gray-400">credits</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-700">+{Number(user.credits_earned).toFixed(1)}</p>
                        <p className="text-xs text-gray-400">earned</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-700">-{Number(user.credits_spent).toFixed(1)}</p>
                        <p className="text-xs text-gray-400">spent</p>
                      </div>
                    </div>

                    {/* Joined date */}
                    <div className="hidden md:block text-right text-xs text-gray-400 flex-shrink-0">
                      <p>Tham gia</p>
                      <p>{new Date(user.created_at).toLocaleDateString('vi-VN')}</p>
                    </div>

                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}