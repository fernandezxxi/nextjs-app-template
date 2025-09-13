import { NextRequest, NextResponse } from 'next/server';
import { MasterDataStorage, Review } from '@/lib/storage';
import fs from 'fs';
import path from 'path';

// Helper function to save uploaded file
async function saveUploadedFile(file: File, filename: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  fs.writeFileSync(filePath, buffer);

  return `/uploads/${filename}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const reportingCriteria = formData.get('reporting_criteria') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const complaintCategoryId = formData.get('complaint_category_id') as string;
    const complaintRelatedId = formData.get('complaint_related_id') as string;
    const rating = parseInt(formData.get('rating') as string);
    const description = formData.get('description') as string;
    const evidenceFile = formData.get('evidence_file') as File;
    const locationId = formData.get('location_id') as string;

    // Server-side validation
    if (!reportingCriteria || !name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Reporting criteria and name are required fields'
        },
        { status: 400 }
      );
    }

    if (!['audience', 'stakeholder'].includes(reportingCriteria)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid reporting criteria. Must be "audience" or "stakeholder"'
        },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 10) {
      return NextResponse.json(
        {
          success: false,
          message: 'Rating must be between 1 and 10'
        },
        { status: 400 }
      );
    }

    // Validate complaint category and related IDs if provided
    if (complaintCategoryId) {
      const categories = MasterDataStorage.getComplaintCategories();
      const categoryExists = categories.some(cat => cat.id === parseInt(complaintCategoryId));
      if (!categoryExists) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid complaint category ID'
          },
          { status: 400 }
        );
      }
    }

    if (complaintRelatedId) {
      const complaints = MasterDataStorage.getComplaintRelated();
      const complaintExists = complaints.some(comp => comp.id === parseInt(complaintRelatedId));
      if (!complaintExists) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid complaint related ID'
          },
          { status: 400 }
        );
      }
    }

    // Handle file upload if provided
    let evidenceFilePath: string | undefined;
    if (evidenceFile && evidenceFile.size > 0) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(evidenceFile.type)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid file type. Only images, PDFs, and text files are allowed'
          },
          { status: 400 }
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (evidenceFile.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            message: 'File size too large. Maximum size is 5MB'
          },
          { status: 400 }
        );
      }

      // Generate unique filename
      const fileExtension = path.extname(evidenceFile.name);
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const filename = `${timestamp}_${randomId}${fileExtension}`;

      evidenceFilePath = await saveUploadedFile(evidenceFile, filename);
    }

    // Create review object
    const reviewData: Omit<Review, 'id' | 'created_at'> = {
      reporting_criteria: reportingCriteria as 'audience' | 'stakeholder',
      name,
      email: email || undefined,
      complaint_category_id: complaintCategoryId ? parseInt(complaintCategoryId) : undefined,
      complaint_related_id: complaintRelatedId ? parseInt(complaintRelatedId) : undefined,
      rating,
      description: description || undefined,
      evidence_file: evidenceFilePath,
      location_id: locationId ? parseInt(locationId) : undefined,
    };

    // Save review
    const savedReview = MasterDataStorage.addReview(reviewData);

    return NextResponse.json({
      success: true,
      data: savedReview,
      message: 'Review submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit review',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    // Get reviews from storage
    const reviews = MasterDataStorage.getReviews();

    // Apply pagination if specified
    let paginatedReviews = reviews;
    if (limit) {
      const startIndex = offset || 0;
      paginatedReviews = reviews.slice(startIndex, startIndex + limit);
    }

    return NextResponse.json({
      success: true,
      data: paginatedReviews,
      total: reviews.length,
      message: 'Reviews retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve reviews',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
