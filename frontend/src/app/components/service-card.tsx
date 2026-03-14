import { Link } from 'react-router';
import { Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { Service, users } from '@/app/data/mock-data';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const provider = users.find(u => u.id === service.userId);

  if (!provider) return null;

  return (
    <Link to={`/service/${service.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Service Image */}
        <div className="relative h-40 overflow-hidden bg-gray-100">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-blue-600 hover:bg-blue-700">
              {service.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {service.description}
          </p>

          {/* Provider Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={provider.avatar} alt={provider.name} />
                <AvatarFallback>{provider.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {provider.name}
                </p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">
                    {provider.rating} ({provider.totalReviews})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Credits & Duration */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{service.duration}h</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-bold text-blue-600">
                {service.totalCredits}
              </span>
              <span className="text-sm text-gray-600">credits</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
