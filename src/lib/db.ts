/**
 * Database Connection Module
 * Uses mysql2/promise for async MySQL operations with prepared statements
 * 
 * DBMS Concepts:
 * - Connection Pooling for efficient database connections
 * - Prepared Statements to prevent SQL Injection
 */

import mysql from 'mysql2/promise';

// Create a connection pool for better performance
// Pool manages multiple connections and reuses them
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'local_service_provider',
  waitForConnections: true,
  connectionLimit: 10,  // Maximum connections in pool
  queueLimit: 0
});

/**
 * Execute a SQL query with prepared statement
 * @param sql - SQL query string with ? placeholders
 * @param params - Array of parameters to replace ? placeholders
 * @returns Query result
 * 
 * Example usage:
 * const users = await query('SELECT * FROM users WHERE id = ?', [1]);
 */
export async function query<T>(sql: string, params: unknown[] = []): Promise<T> {
  try {
    const [results] = await pool.execute(sql, params);
    return results as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a single connection from the pool
 * Useful for transactions
 */
export async function getConnection() {
  return pool.getConnection();
}

export default pool;
