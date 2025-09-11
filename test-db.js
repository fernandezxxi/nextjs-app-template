const mysql = require('mysql2/promise');

// Database configuration moved to bottom

async function testDatabaseConnection() {
  let connection;

  try {
    console.log('🔄 Testing database connection...');
    console.log('Database config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
    });

    // Create connection
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!');

    // Test basic query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Basic query test passed:', rows);

    // Check if tables exist
    console.log('\n🔍 Checking database schema...');

    // Check complaint_categories table
    const [categories] = await connection.execute('SELECT COUNT(*) as count FROM complaint_categories');
    console.log(`✅ complaint_categories table: ${categories[0].count} records`);

    // Check complaint_related table
    const [related] = await connection.execute('SELECT COUNT(*) as count FROM complaint_related');
    console.log(`✅ complaint_related table: ${related[0].count} records`);

    // Check reviews table
    const [reviews] = await connection.execute('SELECT COUNT(*) as count FROM reviews');
    console.log(`✅ reviews table: ${reviews[0].count} records`);

    // Show sample data
    console.log('\n📊 Sample data:');

    const [sampleCategories] = await connection.execute('SELECT id, name, icon_class FROM complaint_categories LIMIT 3');
    console.log('Complaint Categories:', sampleCategories);

    const [sampleRelated] = await connection.execute('SELECT id, name, emoticon FROM complaint_related LIMIT 3');
    console.log('Complaint Related:', sampleRelated);

    const [sampleReviews] = await connection.execute('SELECT id, name, rating, reporting_criteria FROM reviews LIMIT 3');
    console.log('Sample Reviews:', sampleReviews);

    console.log('\n🎉 Database setup and connection test completed successfully!');

  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed.');
    }
  }
}

// Environment variables (fallback to defaults)
const DB_HOST = process.env.DB_HOST || 'customer_reviews_db';
const DB_PORT = parseInt(process.env.DB_PORT || '3306');
const DB_USER = process.env.DB_USER || 'app_user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'app_password';
const DB_NAME = process.env.DB_NAME || 'customer_reviews';

// Database configuration
const dbConfig = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
};

// Run the test
testDatabaseConnection();
