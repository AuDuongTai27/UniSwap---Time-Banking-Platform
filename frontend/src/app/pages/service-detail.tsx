import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Clock, Star, Shield, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { apiFetch, getCurrentUser } from '@/app/data/api';
import { toast } from 'sonner';

export function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [service, setService] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentUserData, setCurrentUserData] = useState<any>(null);

  const currentUser = getCurrentUser();

  useEffect(() => {
    apiFetch(`/api/services/${id}`).then(data => setService(data));
    apiFetch(`/api/services/${id}/reviews`).then(data => setReviews(Array.isArray(data) ? data : []));
    apiFetch('/api/me').then(data => setCurrentUserData(data));
  }, [id]);

  if (!service) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const availableCredits = currentUserData
    ? currentUserData.credits_earned - currentUserData.credits_spent
    : 0;

  const handleBookingRequest = async () => {
    if (!selectedDate) { toast.error('Please select a date and time'); return; }
    if (availableCredits < service.total_credits) {
      toast.error('Not enough credits! Offer your skills to earn more.'); return;
    }
    try {
      await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          service_id: service.id,
          provider_id: service.user_id,
          scheduled_date: selectedDate,
          message,
          credits_amount: service.total_credits,
        }),
      });
      toast.success(`Booking request sent! ${service.provider_name} will be notified.`);
      setShowBookingDialog(false);
      setMessage('');
      setSelectedDate('');
      navigate('/my-activity');
    } catch {
      toast.error('Failed to send booking request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-80 rounded-xl overflow-hidden">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-blue-600">{service.category}</Badge>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{service.title}</CardTitle>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration} hour{service.duration !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-xl font-bold text-blue-600">{service.total_credits} credits</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Reviews</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {reviews.length > 0 ? reviews.map(review => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.reviewer_avatar} alt={review.reviewer_name} />
                        <AvatarFallback>{review.reviewer_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{review.reviewer_name}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )) : <p className="text-gray-500 text-center py-4">No reviews yet</p>}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Service Provider</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={service.provider_avatar} alt={service.provider_name} />
                    <AvatarFallback>{service.provider_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{service.provider_name}</h3>
                      {service.provider_verified && <Shield className="h-4 w-4 text-blue-600" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{service.provider_status}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {service.provider_rating} ({service.provider_total_reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Credits Earned:</span>
                    <span className="font-semibold">{service.provider_credits_earned}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Reviews:</span>
                    <span className="font-semibold">{service.provider_total_reviews}</span>
                  </div>
                </div>
                <Link to={`/user/${service.user_id}`}>
                  <Button variant="outline" className="w-full">View Profile</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Your available credits:</span>
                    <span className="text-2xl font-bold text-blue-600">{availableCredits}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-gray-600">Service cost:</span>
                    <span className="text-2xl font-bold">{service.total_credits}</span>
                  </div>
                  {availableCredits >= service.total_credits ? (
                    <Button
                      onClick={() => setShowBookingDialog(true)}
                      className="w-full h-12"
                      disabled={service.user_id === currentUser?.id}
                    >
                      {service.user_id === currentUser?.id ? 'Your Service' : 'Request Booking'}
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                        Not enough credits. Offer your skills to earn more!
                      </p>
                      <Link to="/post-service">
                        <Button variant="outline" className="w-full">Post Your Service</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Request Booking</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="datetime">Preferred Date & Time</Label>
              <input
                type="datetime-local" id="datetime" value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message to {service.provider_name}</Label>
              <Textarea id="message" placeholder="Introduce yourself..." value={message}
                onChange={(e) => setMessage(e.target.value)} rows={4} />
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>{service.total_credits} credits</strong> will be held until the service is completed.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>Cancel</Button>
            <Button onClick={handleBookingRequest}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}