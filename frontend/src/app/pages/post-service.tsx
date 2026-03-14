import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { categories } from '@/app/data/mock-data';
import { toast } from 'sonner';

export function PostService() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [creditsPerHour, setCreditsPerHour] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category || !duration || !creditsPerHour) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Mock service creation
    toast.success('Service posted successfully! Students can now find and book your service.');
    navigate('/profile');
  };

  const totalCredits = duration && creditsPerHour 
    ? (parseFloat(duration) * parseFloat(creditsPerHour)).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Service</h1>
          <p className="text-gray-600">Share your skills and start earning time credits</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>
                Provide information about the skill or service you want to offer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Statistics Tutoring for Psychology Students"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'All').map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you'll help with, who it's for, and what students can expect..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
                <p className="text-sm text-gray-500">
                  Be specific and welcoming. This helps students understand how you can help them.
                </p>
              </div>

              {/* Duration and Credits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Session Duration (hours) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="8"
                    placeholder="1.5"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditsPerHour">Credits per Hour *</Label>
                  <Input
                    id="creditsPerHour"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="10"
                    placeholder="2"
                    value={creditsPerHour}
                    onChange={(e) => setCreditsPerHour(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Suggested: 1-3 credits/hour
                  </p>
                </div>
              </div>

              {/* Total Credits Preview */}
              {duration && creditsPerHour && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Total session cost:</strong> {totalCredits} time credits
                  </p>
                </div>
              )}

              {/* Image Upload (Mock) */}
              <div className="space-y-2">
                <Label>Service Image (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG or GIF (max. 2MB)
                  </p>
                </div>
              </div>

              {/* Info box */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Tips for Success:</h4>
                <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                  <li>Be clear about what you'll teach or help with</li>
                  <li>Set realistic time estimates</li>
                  <li>Price fairly based on skill complexity</li>
                  <li>Respond quickly to booking requests</li>
                  <li>Be patient and encouraging with learners</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Post Service
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
