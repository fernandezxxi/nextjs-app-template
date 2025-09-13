'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Search, Filter, Eye, Calendar, MapPin, Star, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: number;
  reporting_criteria: 'audience' | 'stakeholder';
  name: string;
  email?: string;
  complaint_category_id?: number;
  complaint_related_id?: number;
  rating: number;
  description?: string;
  evidence_file?: string;
  location_id?: number;
  created_at: string;
}

interface ComplaintCategory {
  id: number;
  name: string;
  icon_class: string;
}

interface ComplaintRelated {
  id: number;
  name: string;
  emoticon: string;
}

interface Location {
  id: number;
  name: string;
  code: string;
}

export default function ReportsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);
  const [complaints, setComplaints] = useState<ComplaintRelated[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedReportingType, setSelectedReportingType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reviews, selectedCategory, selectedLocation, selectedRating, selectedReportingType, searchTerm, dateFrom, dateTo]);

  const fetchData = async () => {
    try {
      const [reviewsRes, categoriesRes, complaintsRes, locationsRes] = await Promise.all([
        fetch('/api/reviews'),
        fetch('/api/master/categories'),
        fetch('/api/master/complaints'),
        fetch('/api/master/locations')
      ]);

      const [reviewsData, categoriesData, complaintsData, locationsData] = await Promise.all([
        reviewsRes.json(),
        categoriesRes.json(),
        complaintsRes.json(),
        locationsRes.json()
      ]);

      if (reviewsData.success) setReviews(reviewsData.data);
      if (categoriesData.success) setCategories(categoriesData.data);
      if (complaintsData.success) setComplaints(complaintsData.data);
      if (locationsData.success) setLocations(locationsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reviews];

    // Category filter
    if (selectedCategory !== 'all') {
      const categoryId = parseInt(selectedCategory);
      filtered = filtered.filter(review => review.complaint_category_id === categoryId);
    }

    // Location filter
    if (selectedLocation !== 'all') {
      const locationId = parseInt(selectedLocation);
      filtered = filtered.filter(review => review.location_id === locationId);
    }

    // Rating filter
    if (selectedRating !== 'all') {
      const rating = parseInt(selectedRating);
      filtered = filtered.filter(review => review.rating === rating);
    }

    // Reporting type filter
    if (selectedReportingType !== 'all') {
      filtered = filtered.filter(review => review.reporting_criteria === selectedReportingType);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filters
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(review => new Date(review.created_at) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(review => new Date(review.created_at) <= toDate);
    }

    setFilteredReviews(filtered);
  };

  const getCategoryName = (categoryId?: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'N/A';
  };

  const getComplaintName = (complaintId?: number) => {
    const complaint = complaints.find(c => c.id === complaintId);
    return complaint?.name || 'N/A';
  };

  const getLocationName = (locationId?: number) => {
    const location = locations.find(l => l.id === locationId);
    return location?.name || 'N/A';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'text-green-600';
    if (rating >= 7) return 'text-yellow-600';
    if (rating >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 9) return 'Promoter';
    if (rating >= 7) return 'Passive';
    return 'Detractor';
  };

  const exportToExcel = () => {
    // Create CSV content
    const headers = [
      'ID', 'Date', 'Name', 'Email', 'Reporting Type', 'Category', 'Complaint Related',
      'Rating', 'NPS Type', 'Description', 'Location', 'Evidence File'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredReviews.map(review => [
        review.id,
        new Date(review.created_at).toLocaleDateString(),
        `"${review.name}"`,
        `"${review.email || ''}"`,
        review.reporting_criteria,
        `"${getCategoryName(review.complaint_category_id)}"`,
        `"${getComplaintName(review.complaint_related_id)}"`,
        review.rating,
        getRatingBadge(review.rating),
        `"${review.description || ''}"`,
        `"${getLocationName(review.location_id)}"`,
        `"${review.evidence_file || ''}"`
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customer_reviews_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Data exported to CSV successfully');
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedRating('all');
    setSelectedReportingType('all');
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Review Reports</h1>
          <p className="text-gray-600 mt-2">Detailed analysis and export of customer feedback</p>
        </div>
        <Button onClick={exportToExcel} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export to CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter reviews by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <Label>Rating</Label>
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger>
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  {[1,2,3,4,5,6,7,8,9,10].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reporting Type Filter */}
            <div className="space-y-2">
              <Label>Reporting Type</Label>
              <Select value={selectedReportingType} onValueChange={setSelectedReportingType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="audience">Audience</SelectItem>
                  <SelectItem value="stakeholder">Stakeholder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            {/* Clear Filters */}
            <div className="space-y-2 flex items-end">
              <Button onClick={clearFilters} variant="outline" className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold">{filteredReviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold">
                  {filteredReviews.length > 0
                    ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold">
                  {new Set(filteredReviews.map(r => r.location_id).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Date Range</p>
                <p className="text-sm font-bold">
                  {filteredReviews.length > 0
                    ? `${new Date(Math.min(...filteredReviews.map(r => new Date(r.created_at).getTime()))).toLocaleDateString()} - ${new Date(Math.max(...filteredReviews.map(r => new Date(r.created_at).getTime()))).toLocaleDateString()}`
                    : 'No data'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Review Details</CardTitle>
          <CardDescription>
            Showing {filteredReviews.length} of {reviews.length} reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Complaint</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>NPS</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">#{review.id}</TableCell>
                    <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{review.name}</TableCell>
                    <TableCell>{review.email || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={review.reporting_criteria === 'audience' ? 'default' : 'secondary'}>
                        {review.reporting_criteria}
                      </Badge>
                    </TableCell>
                    <TableCell>{getCategoryName(review.complaint_category_id)}</TableCell>
                    <TableCell>{getComplaintName(review.complaint_related_id)}</TableCell>
                    <TableCell>
                      <span className={`font-bold ${getRatingColor(review.rating)}`}>
                        {review.rating}/10
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          review.rating >= 9 ? 'default' :
                          review.rating >= 7 ? 'secondary' : 'destructive'
                        }
                      >
                        {getRatingBadge(review.rating)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getLocationName(review.location_id)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {review.description || '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/customer-review/${review.id}`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No reviews found matching the current filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
