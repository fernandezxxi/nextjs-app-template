import fs from 'fs';
import path from 'path';

// Simple file-based storage for demo purposes
export class FileStorage {
  private static dataDir = path.join(process.cwd(), 'data');

  static ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  static readData<T>(filename: string): T[] {
    this.ensureDataDir();
    const filePath = path.join(this.dataDir, filename);

    if (!fs.existsSync(filePath)) {
      return [];
    }

    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return [];
    }
  }

  static writeData<T>(filename: string, data: T[]): void {
    this.ensureDataDir();
    const filePath = path.join(this.dataDir, filename);

    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      throw error;
    }
  }

  static appendData<T>(filename: string, newData: T): void {
    const existingData = this.readData<T>(filename);
    existingData.push(newData);
    this.writeData(filename, existingData);
  }
}

// Master data interfaces
export interface ComplaintCategory {
  id: number;
  name: string;
  icon_class: string;
  description?: string;
}

export interface ComplaintRelated {
  id: number;
  name: string;
  emoticon: string;
  description?: string;
}

export interface Review {
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
  created_at: Date;
}

// Master data storage
export class MasterDataStorage {
  private static categoriesFile = 'complaint_categories.json';
  private static complaintsFile = 'complaint_related.json';
  private static locationsFile = 'locations.json';
  private static reviewsFile = 'reviews.json';

  // Get all complaint categories
  static getComplaintCategories(): ComplaintCategory[] {
    return FileStorage.readData<ComplaintCategory>(this.categoriesFile);
  }

  // Get all complaint related items
  static getComplaintRelated(): ComplaintRelated[] {
    return FileStorage.readData<ComplaintRelated>(this.complaintsFile);
  }

  // Get all locations
  static getLocations(): Location[] {
    return FileStorage.readData<Location>(this.locationsFile);
  }

  // Add a new location
  static addLocation(location: Omit<Location, 'id'>): Location {
    const locations = this.getLocations();
    const newLocation: Location = {
      ...location,
      id: locations.length > 0 ? Math.max(...locations.map(l => l.id)) + 1 : 1,
    };

    FileStorage.appendData(this.locationsFile, newLocation);
    return newLocation;
  }

  // Get all reviews
  static getReviews(): Review[] {
    return FileStorage.readData<Review>(this.reviewsFile);
  }

  // Add a new review
  static addReview(review: Omit<Review, 'id' | 'created_at'>): Review {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...review,
      id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
      created_at: new Date(),
    };

    FileStorage.appendData(this.reviewsFile, newReview);
    return newReview;
  }

  // Initialize master data if not exists
  static initializeMasterData() {
    // Initialize complaint categories
    if (this.getComplaintCategories().length === 0) {
      const categories: ComplaintCategory[] = [
        { id: 1, name: 'Service Quality', icon_class: 'service', description: 'Issues related to service quality' },
        { id: 2, name: 'Product Issues', icon_class: 'product', description: 'Problems with products' },
        { id: 3, name: 'Staff Behavior', icon_class: 'staff', description: 'Staff conduct and behavior' },
        { id: 4, name: 'Facility', icon_class: 'facility', description: 'Facility and environment issues' },
        { id: 5, name: 'Others', icon_class: 'other', description: 'Other miscellaneous issues' },
      ];
      FileStorage.writeData(this.categoriesFile, categories);
    }

    // Initialize complaint related items
    if (this.getComplaintRelated().length === 0) {
      const complaints: ComplaintRelated[] = [
        { id: 1, name: 'Very Satisfied', emoticon: '😊', description: 'Very satisfied with the experience' },
        { id: 2, name: 'Satisfied', emoticon: '🙂', description: 'Generally satisfied' },
        { id: 3, name: 'Neutral', emoticon: '😐', description: 'Neither satisfied nor dissatisfied' },
        { id: 4, name: 'Dissatisfied', emoticon: '😞', description: 'Somewhat dissatisfied' },
        { id: 5, name: 'Very Dissatisfied', emoticon: '😡', description: 'Very dissatisfied' },
      ];
      FileStorage.writeData(this.complaintsFile, complaints);
    }

    // Initialize locations
    if (MasterDataStorage.getLocations().length === 0) {
      const locations: Location[] = [
        { id: 1, code: 'NYC', name: 'New York City', location_class: 'Head Office', address: '123 Broadway, NYC', phone: '+1-212-555-0123', status: 'active', description: 'Manhattan Office' },
        { id: 2, code: 'LAX', name: 'Los Angeles', location_class: 'Branch Office', address: '456 Sunset Blvd, LA', phone: '+1-213-555-0456', status: 'active', description: 'West Coast Office' },
        { id: 3, code: 'CHI', name: 'Chicago', location_class: 'Branch Office', address: '789 Michigan Ave, Chicago', phone: '+1-312-555-0789', status: 'active', description: 'Midwest Office' },
        { id: 4, code: 'MIA', name: 'Miami', location_class: 'Branch Office', address: '321 Ocean Drive, Miami', phone: '+1-305-555-0321', status: 'active', description: 'Southeast Office' },
        { id: 5, code: 'SEA', name: 'Seattle', location_class: 'Branch Office', address: '654 Pike St, Seattle', phone: '+1-206-555-0654', status: 'active', description: 'Pacific Northwest Office' },
        { id: 6, code: 'AUS', name: 'Austin', location_class: 'Branch Office', address: '987 Congress Ave, Austin', phone: '+1-512-555-0987', status: 'active', description: 'Texas Office' },
      ];
      FileStorage.writeData(this.locationsFile, locations);
    }
  }

  // Get review statistics
  static getReviewStats() {
    const reviews = this.getReviews();
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    const categoryStats = reviews.reduce((acc, review) => {
      if (review.complaint_category_id) {
        const category = this.getComplaintCategories().find(c => c.id === review.complaint_category_id);
        if (category) {
          acc[category.name] = (acc[category.name] || 0) + 1;
        }
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      categoryStats,
    };
  }
}

// Initialize master data on module load
MasterDataStorage.initializeMasterData();
