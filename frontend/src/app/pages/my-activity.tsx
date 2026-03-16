import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Star } from 'lucide-react'; // ✅ thêm Star
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { apiFetch } from '@/app/data/api';
import { toast } from 'sonner';

export function MyActivity() {
  const [activeTab, setActiveTab] = useState('requests');
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [myOffers, setMyOffers] = useState<any[]>([]);

  // ✅ Review state
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const fetchData = () => {
    apiFetch('/api/bookings/my-requests').then(data => setMyRequests(Array.isArray(data) ? data : []));
    apiFetch('/api/bookings/my-offers').then(data => setMyOffers(Array.isArray(data) ? data : []));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (bookingId: number, action: string, booking?: any) => {
    await apiFetch(`/api/bookings/${bookingId}/${action}`, { method: 'PATCH' });
    const messages: Record<string, string> = {
      confirm: 'Đã xác nhận booking!',
      cancel: 'Đã hủy booking!',
      complete: 'Đã hoàn thành! Credits đã được chuyển.',
    };
    toast.success(messages[action] || 'Thành công!');
    fetchData();

    // ✅ Sau khi complete → tự mở dialog đánh giá cho requester
    // Trong handleAction (provider complete xong tự mở review)
    if (action === 'complete' && booking) {
      setTimeout(() => openReviewDialog(booking, true), 500); // ← thêm true
    }

    // Nút Leave Review cho requester
    {
      !isProvider && booking.status === 'completed' && !booking.has_reviewed && (
        <Button size="sm" onClick={() => openReviewDialog(booking, false)}> 
          ⭐ Leave Review
        </Button>
      )
    }
  };

  const openReviewDialog = (booking: any, isProvider: boolean) => {
    setReviewBooking({ ...booking, isProvider });
    setReviewRating(5);
    setReviewComment('');
    setShowReviewDialog(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewBooking) return;
    try {
      const res = await apiFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          booking_id: reviewBooking.id,
          reviewed_user_id: reviewBooking.isProvider
            ? reviewBooking.requester_id   // provider đánh giá requester
            : reviewBooking.provider_id,   // requester đánh giá provider
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      setShowReviewDialog(false);
      fetchData();

      // ✅ Dùng response từ backend
      if (res.bothReviewed) {
        toast.success('Cả 2 đã đánh giá! Credits đã được cập nhật 🎉');
      } else {
        toast.info('Đã gửi đánh giá! Đang chờ đối phương đánh giá để hoàn tất credits ⏳');
      }
    } catch {
      toast.error('Gửi đánh giá thất bại');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700' },
      completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
    };
    const variant = variants[status] || variants.pending;
    return <Badge variant="secondary" className={variant.className}>{variant.label}</Badge>;
  };

  const renderBookingCard = (booking: any, isProvider: boolean) => (
    <Card key={booking.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <img src={booking.service_image} alt={booking.service_title}
            className="w-32 h-32 object-cover rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{booking.service_title}</h3>
                <p className="text-sm text-gray-600">{booking.service_category}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {getStatusIcon(booking.status)}
                {getStatusBadge(booking.status)}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={booking.other_user_avatar} alt={booking.other_user_name} />
                <AvatarFallback>{booking.other_user_name?.[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700">
                {isProvider ? 'Requested by' : 'Provided by'} <strong>{booking.other_user_name}</strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(booking.scheduled_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{new Date(booking.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-600">{booking.credits_amount} credits</span>
              </div>
            </div>
            {booking.message && (
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-sm text-gray-700"><strong>Message:</strong> {booking.message}</p>
              </div>
            )}
            <div className="flex gap-2">
              {isProvider && booking.status === 'pending' && (
                <>
                  <Button size="sm" onClick={() => handleAction(booking.id, 'confirm')}>Accept</Button>
                  <Button size="sm" variant="outline" onClick={() => handleAction(booking.id, 'cancel')}>Decline</Button>
                </>
              )}
              {isProvider && booking.status === 'confirmed' && (
                <>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleAction(booking.id, 'complete', booking)}> {/* ✅ truyền booking */}
                    ✅ Mark as Complete
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAction(booking.id, 'cancel')}>
                    Cancel
                  </Button>
                </>
              )}
              {!isProvider && booking.status === 'confirmed' && (
                <Button size="sm" variant="outline" onClick={() => handleAction(booking.id, 'cancel')}>
                  Cancel Booking
                </Button>
              )}
              {/* ✅ Nút Leave Review cho requester sau khi complete */}
              {!isProvider && booking.status === 'completed' && !booking.has_reviewed && (
                <Button size="sm" onClick={() => openReviewDialog(booking, false)}> 
                  ⭐ Leave Review
                </Button>
              )}
              {isProvider && booking.status === 'completed' && booking.has_reviewed && (
                <span className="text-sm text-gray-500 italic">✅ Đã đánh giá</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Activity</h1>
          <p className="text-gray-600">Manage your bookings and service requests</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="requests" className="gap-2">
              My Requests
              {myRequests.length > 0 && <Badge variant="secondary" className="ml-1">{myRequests.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-2">
              Service Requests
              {myOffers.length > 0 && <Badge variant="secondary" className="ml-1">{myOffers.length}</Badge>}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="requests" className="space-y-4">
            {myRequests.length > 0 ? myRequests.map(b => renderBookingCard(b, false)) : (
              <Card><CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No booking requests yet</h3>
                <p className="text-gray-600 mb-4">Browse available services and request help from other students</p>
                <Button onClick={() => window.location.href = '/'}>Browse Services</Button>
              </CardContent></Card>
            )}
          </TabsContent>
          <TabsContent value="offers" className="space-y-4">
            {myOffers.length > 0 ? myOffers.map(b => renderBookingCard(b, true)) : (
              <Card><CardContent className="p-12 text-center">
                <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No service requests yet</h3>
                <p className="text-gray-600 mb-4">Post your services to start helping others and earn time credits</p>
                <Button onClick={() => window.location.href = '/post-service'}>Post a Service</Button>
              </CardContent></Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ✅ REVIEW DIALOG */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đánh giá dịch vụ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-gray-600 mb-3">
                Đánh giá <strong>{reviewBooking?.other_user_name}</strong>
              </p>
              {/* Star Rating */}
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setReviewRating(star)}
                  >
                    <Star className={`h-8 w-8 transition-colors ${star <= (hoveredStar || reviewRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                      }`} />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                {['', 'Tệ', 'Không tốt', 'Bình thường', 'Tốt', 'Xuất sắc'][reviewRating]}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Nhận xét</Label>
              <Textarea
                placeholder="Chia sẻ trải nghiệm của bạn..."
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>Hủy</Button>
            <Button onClick={handleSubmitReview}>Gửi đánh giá</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}