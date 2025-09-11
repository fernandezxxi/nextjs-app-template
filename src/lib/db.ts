import mysql from 'mysql2/promise';

// Database configuration interface
interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

// Get database configuration from environment variables
const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'app_password',
  database: process.env.DB_NAME || 'customer_reviews',
};

// Create connection pool for better performance
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Database connection utility class
export class Database {
  private static instance: Database;
  private pool: mysql.Pool;

  private constructor() {
    this.pool = pool;
  }

  // Singleton pattern to ensure single database instance
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Execute a query with parameters
  public async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Execute a query and return the first row
  public async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    try {
      const rows = await this.query<T>(sql, params);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Database queryOne error:', error);
      throw error;
    }
  }

  // Insert a record and return the inserted ID
  public async insert(sql: string, params?: any[]): Promise<number> {
    try {
      const [result] = await this.pool.execute(sql, params);
      const insertResult = result as mysql.ResultSetHeader;
      return insertResult.insertId;
    } catch (error) {
      console.error('Database insert error:', error);
      throw new Error(`Database insert failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update records and return affected rows count
  public async update(sql: string, params?: any[]): Promise<number> {
    try {
      const [result] = await this.pool.execute(sql, params);
      const updateResult = result as mysql.ResultSetHeader;
      return updateResult.affectedRows;
    } catch (error) {
      console.error('Database update error:', error);
      throw new Error(`Database update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Delete records and return affected rows count
  public async delete(sql: string, params?: any[]): Promise<number> {
    try {
      const [result] = await this.pool.execute(sql, params);
      const deleteResult = result as mysql.ResultSetHeader;
      return deleteResult.affectedRows;
    } catch (error) {
      console.error('Database delete error:', error);
      throw new Error(`Database delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Test database connection
  public async testConnection(): Promise<boolean> {
    try {
      await this.query('SELECT 1 as test');
      console.log('Database connection successful');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  // Close the connection pool
  public async close(): Promise<void> {
    try {
      await this.pool.end();
      console.log('Database connection pool closed');
    } catch (error) {
      console.error('Error closing database connection pool:', error);
    }
  }

  // Get connection pool statistics
  public getPoolStats() {
    return {
      totalConnections: 10, // connectionLimit from pool config
      message: 'Pool statistics available in production with proper monitoring',
    };
  }
}

// Export singleton instance
export const db = Database.getInstance();

// Type definitions for database entities
export interface ComplaintCategory {
  id: number;
  name: string;
  icon_class: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ComplaintRelated {
  id: number;
  name: string;
  emoticon: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
  updated_at: Date;
}

export interface ReviewWithDetails extends Review {
  category_name?: string;
  category_icon?: string;
  related_name?: string;
  related_emoticon?: string;
}

// Utility functions for common database operations
export const dbUtils = {
  // Get all complaint categories
  async getComplaintCategories(): Promise<ComplaintCategory[]> {
    return db.query<ComplaintCategory>(
      'SELECT * FROM complaint_categories ORDER BY name'
    );
  },

  // Get all complaint related items
  async getComplaintRelated(): Promise<ComplaintRelated[]> {
    return db.query<ComplaintRelated>(
      'SELECT * FROM complaint_related ORDER BY name'
    );
  },

  // Insert a new review
  async insertReview(reviewData: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const sql = `
      INSERT INTO reviews (
        reporting_criteria, name, email, complaint_category_id, 
        complaint_related_id, rating, description, evidence_file
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    return db.insert(sql, [
      reviewData.reporting_criteria,
      reviewData.name,
      reviewData.email,
      reviewData.complaint_category_id,
      reviewData.complaint_related_id,
      reviewData.rating,
      reviewData.description,
      reviewData.evidence_file,
    ]);
  },

  // Get reviews with category and related details
  async getReviewsWithDetails(limit?: number, offset?: number): Promise<ReviewWithDetails[]> {
    let sql = `
      SELECT 
        r.*,
        cc.name as category_name,
        cc.icon_class as category_icon,
        cr.name as related_name,
        cr.emoticon as related_emoticon
      FROM reviews r
      LEFT JOIN complaint_categories cc ON r.complaint_category_id = cc.id
      LEFT JOIN complaint_related cr ON r.complaint_related_id = cr.id
      ORDER BY r.created_at DESC
    `;
    
    const params: any[] = [];
    if (limit) {
      sql += ' LIMIT ?';
      params.push(limit);
      
      if (offset) {
        sql += ' OFFSET ?';
        params.push(offset);
      }
    }
    
    return db.query<ReviewWithDetails>(sql, params);
  },

  // Get review statistics
  async getReviewStats() {
    const totalReviews = await db.queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM reviews'
    );
    
    const avgRating = await db.queryOne<{ avg_rating: number }>(
      'SELECT AVG(rating) as avg_rating FROM reviews'
    );
    
    const categoryStats = await db.query<{ category_name: string; count: number }>(
      `SELECT cc.name as category_name, COUNT(*) as count 
       FROM reviews r 
       JOIN complaint_categories cc ON r.complaint_category_id = cc.id 
       GROUP BY cc.id, cc.name 
       ORDER BY count DESC`
    );
    
    return {
      totalReviews: totalReviews?.count || 0,
      averageRating: avgRating?.avg_rating || 0,
      categoryStats,
    };
  },
};
