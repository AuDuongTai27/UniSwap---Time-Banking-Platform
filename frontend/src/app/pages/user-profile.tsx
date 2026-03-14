import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Star, Shield, Award, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { ServiceCard } from '@/app/components/service-card';
import { apiFetch } from '@/app/data/api';

export function UserProfile() {
  const { id } = useParams(); // ✅ lấy id từ URL
  const [user, setUser] = useState<any>(null);
  const [userServices, setUserServices] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);

  useEffect(() => {
    apiFetch(`/api/users/${id}`).then(data => setUser(data));
    apiFetch(`/api/users/${id}/services`).then(data => setUserServices(Array.isArray(data) ? data : []));
    apiFetch(`/api/users/${id}/reviews`).then(data => setUserReviews(Array.isArray(data) ? data : []));
  }, [id]);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const parseJSON = (val: any) => Array.isArray(val) ? val : JSON.parse(val || '[]');
  const skillsOffered = parseJSON(user.skills_offered);
  const skillsNeeded = parseJSON(user.skills_needed);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                  {user.is_verified && (
                    <Badge variant="secondary" className="gap-1">
                      <Shield className="h-3 w-3" />Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{user.status}</p>
                <p className="text-gray-700 italic mb-4">"{user.bio}"</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{user.rating}</span>
                    <span className="text-gray-600">({user.total_reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">{user.credits_earned}</span>
                    <span className="text-gray-600">credits earned</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Skills Offered</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skillsOffered.map((skill: string, i: number) => (
                  <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-700">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Skills Needed</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skillsNeeded.map((skill: string, i: number) => (
                  <Badge key={i} variant="secondary" className="bg-purple-100 text-purple-700">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {userServices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Services by {user.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userServices.map((service: any) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}

        {userReviews.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Reviews ({userReviews.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userReviews.map((review: any) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}