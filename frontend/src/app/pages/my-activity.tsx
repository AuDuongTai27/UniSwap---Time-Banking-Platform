import { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { bookings, users, services, currentUserId } from '@/app/data/mock-data';
import { toast } from 'sonner';

export function MyActivity() {
  const [activeTab, setActiveTab] = useState('requests');

  // Bookings where current user is the requester
  const myRequests = bookings.filter(b => b.requesterId === currentUserId);
  
  // Bookings where current user is the provider
  const myOffers = bookings.filter(b => b.providerId === currentUserId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
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
    return (
      <Badge variant="secondary" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const renderBookingCard = (booking: any, isProvider: boolean) => {
    const service = services.find(s => s.id === booking.serviceId);
    const otherUser = isProvider
      ? users.find(u => u.id === booking.requesterId)
      : users.find(u => u.id === booking.providerId);

    if (!service || !otherUser) return null;

    return (
      <Card key={booking.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-4">
            {/* Service Image */}
            <img
              src={service.image}
              alt={service.title}
              className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.category}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {getStatusIcon(booking.status)}
                  {getStatusBadge(booking.status)}
                </div>
              </div>

              {/* Other user info */}
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                  <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700">
                  {isProvider ? 'Requested by' : 'Provided by'} <strong>{otherUser.name}</strong>
                </span>
              </div>

              {/* Booking details */}
              <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(booking.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-blue-600">{booking.creditsAmount} credits</span>
                </div>
              </div>

              {/* Message */}
              {booking.message && (
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <p className="text-sm text-gray-700">
                    <strong>Message:</strong> {booking.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {isProvider && booking.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => toast.success('Booking confirmed!')}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.info('Booking declined')}
                    >
                      Decline
                    </Button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info('Cancellation requested')}
                  >
                    Cancel Booking
                  </Button>
                )}
                {booking.status === 'completed' && !isProvider && (
                  <Button
                    size="sm"
                    onClick={() => toast.success('Review submitted!')}
                  >
                    Leave Review
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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
              {myRequests.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {myRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-2">
              Service Requests
              {myOffers.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {myOffers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            {myRequests.length > 0 ? (
              myRequests.map(booking => renderBookingCard(booking, false))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No booking requests yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Browse available services and request help from other students
                  </p>
                  <Button onClick={() => window.location.href = '/'}>
                    Browse Services
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="offers" className="space-y-4">
            {myOffers.length > 0 ? (
              myOffers.map(booking => renderBookingCard(booking, true))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No service requests yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Post your services to start helping others and earn time credits
                  </p>
                  <Button onClick={() => window.location.href = '/post-service'}>
                    Post a Service
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
