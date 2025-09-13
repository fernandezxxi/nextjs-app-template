import { NextRequest, NextResponse } from 'next/server';
import { MasterDataStorage } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // 'all', 'month', 'week', 'day'
    const locationFilter = searchParams.get('location'); // Optional location filter
    const categoryFilter = searchParams.get('category'); // Optional category filter

    // Get all reviews
    const reviews = MasterDataStorage.getReviews();
    const categories = MasterDataStorage.getComplaintCategories();
    const complaints = MasterDataStorage.getComplaintRelated();

    // Filter reviews by period
    let filteredReviews = reviews;
    const now = new Date();

    if (period === 'month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredReviews = reviews.filter(review => new Date(review.created_at) >= oneMonthAgo);
    } else if (period === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredReviews = reviews.filter(review => new Date(review.created_at) >= oneWeekAgo);
    } else if (period === 'day') {
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      filteredReviews = reviews.filter(review => new Date(review.created_at) >= oneDayAgo);
    }

    // Filter by location if specified
    if (locationFilter && locationFilter !== 'all') {
      const locationId = parseInt(locationFilter);
      if (!isNaN(locationId)) {
        filteredReviews = filteredReviews.filter(review => review.location_id === locationId);
      }
    }

    // Filter by category if specified
    if (categoryFilter && categoryFilter !== 'all') {
      const categoryId = parseInt(categoryFilter);
      if (!isNaN(categoryId)) {
        filteredReviews = filteredReviews.filter(review => review.complaint_category_id === categoryId);
      }
    }

    // Calculate summary statistics
    const totalReviews = filteredReviews.length;
    const averageRating = totalReviews > 0
      ? filteredReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    // Category distribution
    const categoryStats = categories.map(category => {
      const categoryReviews = filteredReviews.filter(review => review.complaint_category_id === category.id);
      return {
        id: category.id,
        name: category.name,
        icon_class: category.icon_class,
        count: categoryReviews.length,
        percentage: totalReviews > 0 ? Math.round((categoryReviews.length / totalReviews) * 100) : 0,
        averageRating: categoryReviews.length > 0
          ? categoryReviews.reduce((sum, review) => sum + review.rating, 0) / categoryReviews.length
          : 0
      };
    }).filter(stat => stat.count > 0);

    // Complaint related distribution
    const complaintStats = complaints.map(complaint => {
      const complaintReviews = filteredReviews.filter(review => review.complaint_related_id === complaint.id);
      return {
        id: complaint.id,
        name: complaint.name,
        emoticon: complaint.emoticon,
        count: complaintReviews.length,
        percentage: totalReviews > 0 ? Math.round((complaintReviews.length / totalReviews) * 100) : 0
      };
    }).filter(stat => stat.count > 0);

    // Reporting criteria distribution
    const reportingCriteriaStats = [
      {
        criteria: 'audience',
        count: filteredReviews.filter(review => review.reporting_criteria === 'audience').length,
        percentage: totalReviews > 0 ? Math.round((filteredReviews.filter(review => review.reporting_criteria === 'audience').length / totalReviews) * 100) : 0
      },
      {
        criteria: 'stakeholder',
        count: filteredReviews.filter(review => review.reporting_criteria === 'stakeholder').length,
        percentage: totalReviews > 0 ? Math.round((filteredReviews.filter(review => review.reporting_criteria === 'stakeholder').length / totalReviews) * 100) : 0
      }
    ];

    // Rating distribution (NPS style)
    const ratingStats = {
      promoters: filteredReviews.filter(review => review.rating >= 9).length, // 9-10
      passives: filteredReviews.filter(review => review.rating >= 7 && review.rating <= 8).length, // 7-8
      detractors: filteredReviews.filter(review => review.rating <= 6).length, // 0-6
      nps: totalReviews > 0
        ? Math.round(((filteredReviews.filter(review => review.rating >= 9).length - filteredReviews.filter(review => review.rating <= 6).length) / totalReviews) * 100)
        : 0
    };

    // Timeline data (last 30 days) - using filtered reviews to respect filters
    const timelineData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayReviews = filteredReviews.filter(review => {
        const reviewDate = new Date(review.created_at).toISOString().split('T')[0];
        return reviewDate === dateStr;
      });

      timelineData.push({
        date: dateStr,
        count: dayReviews.length,
        averageRating: dayReviews.length > 0
          ? dayReviews.reduce((sum, review) => sum + review.rating, 0) / dayReviews.length
          : 0
      });
    }

    const summary = {
      period,
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      categoryStats,
      complaintStats,
      reportingCriteriaStats,
      ratingStats,
      timelineData,
      generatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: summary,
      message: 'Review summary retrieved successfully'
    });

  } catch (error) {
    console.error('Error generating review summary:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate review summary',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
