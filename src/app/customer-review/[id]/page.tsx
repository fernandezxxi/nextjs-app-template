'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Star, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { getCategoryById, getComplaintById, getLocationByCode } from '@/lib/masterData';

// Review detail interface
interface ReviewDetail {
  id: number;
  reporting_criteria: 'audience' | 'stakeholder';
  name: string;
  email?: string;
  complaint_category_id: number;
  complaint_related_id: number;
  rating: number;
  description?: string;
  evidence_file?: string;
  location_id?: number;
  created_at: string;
}

export default function ReviewDetailPage() {
  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const reviewId = params.id as string;

  useEffect(() => {
    const fetchReviewDetail = async () => {
      try {
        const response = await fetch(`/api/reviews/${reviewId}`);
        if (response.ok) {
          const data = await response.json();
          setReview(data.data);
        } else {
          toast.error('Failed to load review details');
        }
      } catch (error) {
        console.error('Error fetching review:', error);
        toast.error('Failed to load review details');
      } finally {
        setLoading(false);
      }
    };

    if (reviewId) {
      fetchReviewDetail();
    }
  }, [reviewId]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 10 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getCategoryInfo = (categoryId: number) => {
    return getCategoryById(categoryId);
  };

  const getComplaintInfo = (complaintId: number) => {
    return getComplaintById(complaintId);
  };

  const getLocationInfo = (locationId?: number) => {
    if (!locationId) return null;
    // For now, we'll use a simple mapping. In a real app, you'd fetch from the locations API
    const locations = [
      { id: 1, code: 'NYC', name: 'New York City' },
      { id: 2, code: 'LAX', name: 'Los Angeles' },
      { id: 3, code: 'CHI', name: 'Chicago' },
      { id: 4, code: 'MIA', name: 'Miami' },
      { id: 5, code: 'SEA', name: 'Seattle' },
      { id: 6, code: 'AUS', name: 'Austin' },
    ];
    return locations.find(loc => loc.id === locationId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Review Not Found</h1>
          <p className="text-gray-600 mb-6">The review you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(review.complaint_category_id);
  const complaintInfo = getComplaintById(review.complaint_related_id);
  const locationInfo = getLocationInfo(review.location_id);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Review Details</h1>
              <p className="text-gray-600">Review ID: #{review.id}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            {new Date(review.created_at).toLocaleDateString()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Review Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Name</Label>
                    <p className="text-lg font-medium">{review.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-lg">{review.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Reporting Criteria</Label>
                    <Badge variant={review.reporting_criteria === 'audience' ? 'default' : 'secondary'}>
                      {review.reporting_criteria === 'audience' ? 'Audience' : 'Stakeholder'}
                    </Badge>
                  </div>
                  {locationInfo && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Location</Label>
                      <p className="text-lg">{locationInfo.name}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Complaint Details */}
            <Card>
              <CardHeader>
                <CardTitle>Complaint Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Category</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                        {categoryInfo?.icon_class.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{categoryInfo?.name}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Related</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-lg">{complaintInfo?.emoticon}</span>
                      <span className="font-medium">{complaintInfo?.name}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-gray-500">Rating (NPS Score)</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    {renderStars(review.rating)}
                    <span className="text-lg font-medium ml-2">{review.rating}/10</span>
                  </div>
                </div>

                {review.description && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Description</Label>
                      <p className="mt-2 text-gray-700 whitespace-pre-wrap">{review.description}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Evidence File */}
            {review.evidence_file && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evidence File</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {review.evidence_file.split('/').pop()}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(review.evidence_file, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push('/customer-review/summary')}
                >
                  View All Reviews
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push('/customer-review')}
                >
                  Submit New Review
                </Button>
              </CardContent>
            </Card>

            {/* Follow-up Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Follow-up Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="w-full justify-center py-2">
                  Pending Review
                </Badge>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  This review is pending follow-up action
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Label component for consistency
function Label({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
      {children}
    </label>
  );
}
