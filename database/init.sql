-- Customer Reviews Database Schema
-- This script initializes the database with tables and seed data

-- Create database if not exists (Docker will create it, but keeping for reference)
-- CREATE DATABASE IF NOT EXISTS customer_reviews;
-- USE customer_reviews;

-- Table for complaint categories with icons
CREATE TABLE IF NOT EXISTS complaint_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    icon_class VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for complaint related items with emoticons
CREATE TABLE IF NOT EXISTS complaint_related (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    emoticon VARCHAR(10) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for customer reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reporting_criteria ENUM('audience', 'stakeholder') NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    complaint_category_id INT,
    complaint_related_id INT,
    rating INT NOT NULL CHECK (rating >= 0 AND rating <= 10),
    description TEXT,
    evidence_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_category_id) REFERENCES complaint_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (complaint_related_id) REFERENCES complaint_related(id) ON DELETE SET NULL,
    INDEX idx_created_at (created_at),
    INDEX idx_rating (rating),
    INDEX idx_reporting_criteria (reporting_criteria)
);

-- Seed data for complaint categories
INSERT INTO complaint_categories (name, icon_class, description) VALUES
('Service Quality', 'service-icon', 'Issues related to service delivery and quality'),
('Product Issues', 'product-icon', 'Problems with products or merchandise'),
('Staff Behavior', 'staff-icon', 'Concerns about staff conduct and professionalism'),
('Facility & Environment', 'facility-icon', 'Issues with physical facilities and environment'),
('Billing & Payment', 'billing-icon', 'Problems with billing, pricing, and payment processes'),
('Others', 'others-icon', 'Other complaints not covered in above categories');

-- Seed data for complaint related items with emoticons
INSERT INTO complaint_related (name, emoticon, description) VALUES
('Very Satisfied', '😊', 'Extremely happy with the experience'),
('Satisfied', '🙂', 'Generally pleased with the service'),
('Neutral', '😐', 'Neither satisfied nor dissatisfied'),
('Dissatisfied', '😞', 'Unhappy with the experience'),
('Very Dissatisfied', '😡', 'Extremely unhappy and frustrated');

-- Create indexes for better performance
CREATE INDEX idx_complaint_categories_name ON complaint_categories(name);
CREATE INDEX idx_complaint_related_name ON complaint_related(name);

-- Insert some sample review data for testing
INSERT INTO reviews (reporting_criteria, name, email, complaint_category_id, complaint_related_id, rating, description) VALUES
('audience', 'John Doe', 'john.doe@example.com', 1, 4, 3, 'Service was slow and staff seemed uninterested in helping customers.'),
('stakeholder', 'Jane Smith', 'jane.smith@company.com', 2, 5, 2, 'Product quality was below expectations and did not match the description.'),
('audience', 'Mike Johnson', 'mike.j@email.com', 3, 3, 5, 'Staff was professional but the waiting time was reasonable.'),
('audience', 'Sarah Wilson', 'sarah.w@example.com', 4, 2, 7, 'Facility was clean and well-maintained. Good experience overall.'),
('stakeholder', 'David Brown', 'david.brown@business.com', 5, 4, 4, 'Billing process was confusing and took longer than expected.');

-- Show tables and data for verification
SELECT 'Complaint Categories:' as info;
SELECT * FROM complaint_categories;

SELECT 'Complaint Related:' as info;
SELECT * FROM complaint_related;

SELECT 'Sample Reviews:' as info;
SELECT * FROM reviews LIMIT 5;
