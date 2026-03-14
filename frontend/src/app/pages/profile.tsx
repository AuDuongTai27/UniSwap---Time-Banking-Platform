import { Star, Shield, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { users, currentUserId, services, reviews } from '@/app/data/mock-data';

export function Profile() {
  const currentUser = users.find(u => u.id === currentUserId);
  const userServices = services.filter(s => s.userId === currentUserId);
  const userReviews = reviews.filter(r => r.reviewedUserId === currentUserId);
  
  if (!currentUser) return null;

  const availableCredits = currentUser.creditsEarned - currentUser.creditsSpent;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-32 w-32 border-4 border-blue-200">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="text-3xl">{currentUser.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
                  {currentUser.verified && (
                    <Badge variant="secondary" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{currentUser.status}</p>
                <p className="text-gray-700 italic mb-4">"{currentUser.bio}"</p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{currentUser.rating}</span>
                    <span className="text-gray-600">({currentUser.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">{currentUser.creditsEarned}</span>
                    <span className="text-gray-600">credits earned</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Credits Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Credits Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
                <span className="text-4xl font-bold text-blue-600">{availableCredits}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Earned:</span>
                  <span className="font-semibold text-green-600">+{currentUser.creditsEarned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spent:</span>
                  <span className="font-semibold text-red-600">-{currentUser.creditsSpent}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Services Posted</span>
                  <span className="font-semibold">{userServices.length}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Reviews Received</span>
                  <span className="font-semibold">{currentUser.totalReviews}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-semibold">{currentUser.rating}/5.0</span>
                </div>
                <Progress value={currentUser.rating * 20} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Community Rank */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Standing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-2xl font-bold mb-2">
                  #2
                </div>
                <p className="text-sm text-gray-600">Top Helper</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trust Score:</span>
                  <span className="font-semibold text-green-600">Excellent</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Rate:</span>
                  <span className="font-semibold">95%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Offered */}
          <Card>
            <CardHeader>
              <CardTitle>Skills I Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentUser.skillsOffered.map((skill, index) => (
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
              <CardTitle>Skills I Need</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentUser.skillsNeeded.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Services */}
        {userServices.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>My Posted Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userServices.map(service => (
                  <div key={service.id} className="flex items-start gap-4 p-4 border rounded-lg hover:border-blue-300 transition-colors">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline">{service.category}</Badge>
                        <span className="text-gray-600">{service.duration}h</span>
                        <span className="font-semibold text-blue-600">{service.totalCredits} credits</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews */}
        {userReviews.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
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
