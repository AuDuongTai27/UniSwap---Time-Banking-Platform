import { useParams, Link } from 'react-router';
import { Star, Shield, Award, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { ServiceCard } from '@/app/components/service-card';
import { users, services, reviews } from '@/app/data/mock-data';

export function UserProfile() {
  const { id } = useParams();
  const user = users.find(u => u.id === id);
  const userServices = services.filter(s => s.userId === id);
  const userReviews = reviews.filter(r => r.reviewedUserId === id);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-32 w-32 border-4 border-blue-200">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-3xl">{user.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  {user.verified && (
                    <Badge variant="secondary" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{user.status}</p>
                <p className="text-gray-700 italic mb-4">"{user.bio}"</p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{user.rating}</span>
                    <span className="text-gray-600">({user.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">{user.creditsEarned}</span>
                    <span className="text-gray-600">credits earned</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Skills Offered */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Skills Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills Needed */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Needed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skillsNeeded.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        {userServices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Services by {user.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {userReviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Reviews ({userReviews.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userReviews.map(review => {
                  const reviewer = users.find(u => u.id === review.reviewerId);
                  return (
                    <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={reviewer?.avatar} alt={reviewer?.name} />
                          <AvatarFallback>{reviewer?.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{reviewer?.name}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
