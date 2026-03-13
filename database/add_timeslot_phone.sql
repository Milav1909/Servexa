-- =====================================================
-- MIGRATION: Add time_slot to bookings and phone to service_providers
-- =====================================================

-- Add time_slot column to bookings table
-- Stores the selected time range (e.g., "09:00 AM - 10:00 AM")
ALTER TABLE bookings ADD COLUMN time_slot VARCHAR(20) AFTER booking_date;

-- Add phone column to service_providers table
-- Stores provider's contact phone number
ALTER TABLE service_providers ADD COLUMN phone VARCHAR(20) AFTER pincode;
