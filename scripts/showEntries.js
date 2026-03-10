const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if exists
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value && !key.startsWith('#')) {
        process.env[key.trim()] = value.trim();
      }
    });
  }
}

loadEnv();

async function showDatabase() {
  let connection;
  try {
    // Create connection using environment variables or defaults
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'local_service_provider'
    });

    console.log('\n🗄️  DATABASE ENTRIES - Local Service Provider\n');
    console.log('='.repeat(80));

    // Define tables to display
    const tables = ['users', 'service_providers', 'services', 'bookings', 'reviews'];

    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SELECT * FROM ${table}`);
        
        console.log(`\n📋 TABLE: ${table.toUpperCase()}`);
        console.log('-'.repeat(80));
        
        if (rows.length === 0) {
          console.log('  (no entries)');
        } else {
          // Display in table format
          console.table(rows);
          console.log(`  Total: ${rows.length} record(s)`);
        }
      } catch (error) {
        console.error(`  ❌ Error reading ${table}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Database display completed\n');

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

showDatabase();
