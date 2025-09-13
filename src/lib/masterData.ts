// Master data for the application
export interface Location {
  id: number;
  code: string;
  name: string;
  location_class?: string;
  address?: string;
  phone?: string;
  status: 'active' | 'inactive';
  description?: string;
}

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

// Master data arrays
export const locations: Location[] = [
  { id: 1, code: 'NYC', name: 'New York City', location_class: 'Head Office', address: '123 Broadway, NYC', phone: '+1-212-555-0123', status: 'active', description: 'Manhattan Office' },
  { id: 2, code: 'LAX', name: 'Los Angeles', location_class: 'Branch Office', address: '456 Sunset Blvd, LA', phone: '+1-213-555-0456', status: 'active', description: 'West Coast Office' },
  { id: 3, code: 'CHI', name: 'Chicago', location_class: 'Branch Office', address: '789 Michigan Ave, Chicago', phone: '+1-312-555-0789', status: 'active', description: 'Midwest Office' },
  { id: 4, code: 'MIA', name: 'Miami', location_class: 'Branch Office', address: '321 Ocean Drive, Miami', phone: '+1-305-555-0321', status: 'active', description: 'Southeast Office' },
  { id: 5, code: 'SEA', name: 'Seattle', location_class: 'Branch Office', address: '654 Pike St, Seattle', phone: '+1-206-555-0654', status: 'active', description: 'Pacific Northwest Office' },
  { id: 6, code: 'AUS', name: 'Austin', location_class: 'Branch Office', address: '987 Congress Ave, Austin', phone: '+1-512-555-0987', status: 'active', description: 'Texas Office' },
];

export const complaintCategories: ComplaintCategory[] = [
  { id: 1, name: 'Service Quality', icon_class: '⚙️', description: 'Issues related to service quality' },
  { id: 2, name: 'Product Issues', icon_class: '📦', description: 'Problems with products or features' },
  { id: 3, name: 'Staff Behavior', icon_class: '👥', description: 'Concerns about staff conduct' },
  { id: 4, name: 'Facility', icon_class: '🏢', description: 'Building or facility related issues' },
  { id: 5, name: 'Others', icon_class: '❓', description: 'Other types of complaints' },
];

export const complaintRelated: ComplaintRelated[] = [
  { id: 1, name: 'Very Satisfied', emoticon: '😊', description: 'Highly positive experience' },
  { id: 2, name: 'Satisfied', emoticon: '🙂', description: 'Generally positive experience' },
  { id: 3, name: 'Neutral', emoticon: '😐', description: 'Neither positive nor negative' },
  { id: 4, name: 'Dissatisfied', emoticon: '😞', description: 'Somewhat negative experience' },
  { id: 5, name: 'Very Dissatisfied', emoticon: '😡', description: 'Highly negative experience' },
];

// Helper functions
export const getLocationByCode = (code: string): Location | undefined => {
  return locations.find(location => location.code === code);
};

export const getCategoryById = (id: number): ComplaintCategory | undefined => {
  return complaintCategories.find(category => category.id === id);
};

export const getComplaintById = (id: number): ComplaintRelated | undefined => {
  return complaintRelated.find(complaint => complaint.id === id);
};
