import { Clock, Users, Star, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Create Your Profile',
      description: 'Sign up and list the skills you can offer and what you need help with.',
      icon: Users,
    },
    {
      number: 2,
      title: 'Post or Browse Services',
      description: 'Offer your skills to earn credits, or find services you need.',
      icon: Clock,
    },
    {
      number: 3,
      title: 'Trade Time, Not Money',
      description: 'Book sessions using time credits. 1 credit = 1 hour of help.',
      icon: ArrowRight,
    },
    {
      number: 4,
      title: 'Build Trust & Reputation',
      description: 'Leave reviews and earn a trusted reputation in the community.',
      icon: Star,
    },
  ];

  const principles = [
    {
      icon: Clock,
      title: 'Fair Exchange',
      description: 'Everyone\'s time is valued equally. No one needs to feel like a burden.',
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Verified profiles, ratings, and reviews help you know who you\'re working with.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We\'re building a supportive network where students help each other succeed.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How UniSwap Works
          </h1>
          <p className="text-xl text-blue-50">
            A fair and simple way to exchange skills using time credits
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Getting Started is Easy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.number} className="text-center">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold mb-4">
                      {step.number}
                    </div>
                    <Icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Principles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Our Core Principles
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            UniSwap is built on values that create a supportive and trustworthy community
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                      {principle.title}
                    </h3>
                    <p className="text-gray-600">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How Credits Work */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">How Time Credits Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                    +
                  </div>
                  Earning Credits
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Post your skills as services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Accept booking requests from students</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Complete the session and earn credits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Build your reputation with positive reviews</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    −
                  </div>
                  Spending Credits
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Browse services you need help with</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Request a booking with a message</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Credits are held until session is complete</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Leave a review to help the community</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <p className="text-blue-900 text-center">
                <strong>Example:</strong> If you help someone for 2 hours, you earn 2 credits. 
                You can then use those 2 credits to get 2 hours of help from someone else.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Real Student Stories
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            See how students are using UniSwap to support each other
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mai's Story */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
                    alt="Mai Nguyen"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">Mai Nguyen</h3>
                    <p className="text-sm text-gray-600">1st-year Psychology student</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "I don't need charity — I just need a fair way to trade what I can do for what I need."
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <strong className="text-green-600">Offers:</strong> English conversation, note-taking, social media help
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-blue-600">Needs:</strong> Statistics tutoring, Excel, research methods
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Daniel's Story */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                    alt="Daniel Tran"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">Daniel Tran</h3>
                    <p className="text-sm text-gray-600">4th-year Computer Science student</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "I love helping people — I just want my time to finally count for something."
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <strong className="text-green-600">Offers:</strong> Web dev, programming, laptop repair, graphic design
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-blue-600">Needs:</strong> Language tutoring, photography, public speaking
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Trading Skills?
          </h2>
          <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
            Join a community where every student's time and skills are valued equally
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" variant="secondary" className="gap-2">
                Browse Services
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/post-service">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                Post Your Service
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
