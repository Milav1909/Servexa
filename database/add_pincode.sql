-- =====================================================
-- ADD PINCODE COLUMN TO SERVICE_PROVIDERS TABLE
-- Run this if you already have the database created
-- =====================================================

USE local_service_provider;

-- Add pincode column to service_providers table
ALTER TABLE service_providers ADD COLUMN pincode VARCHAR(10) AFTER location;

-- Update existing providers with sample pincodes
UPDATE service_providers SET pincode = '380001' WHERE id = 1;
UPDATE service_providers SET pincode = '382422' WHERE id = 2;
UPDATE service_providers SET pincode = '382010' WHERE id = 3;
UPDATE service_providers SET pincode = '380015' WHERE id = 4;
UPDATE service_providers SET pincode = '395001' WHERE id = 5;

-- Verify the column was added
SELECT id, name, location, pincode FROM service_providers;
