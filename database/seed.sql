-- =====================================================
-- SAMPLE DATA FOR LOCAL SERVICE PROVIDER SYSTEM
-- =====================================================
-- Note: Passwords are hashed using bcrypt
-- Sample password for all users: "password123"
-- Hash: $2a$10$X7UrE9N2jPq6ZrKxK5L5Gu8eJQF6Z5HkJZ5H5J5H5J5H5J5H5J5H5
-- =====================================================

USE local_service_provider;

-- =====================================================
-- INSERT sample users (customers)
-- =====================================================
INSERT INTO users (name, email, password) VALUES
('John Doe', 'john@example.com', '$2a$10$rQnM1vN.YdH5TqwL5CZn5eHqZB5vzDX5lIrUFKdNqE3lK5M5n5L5K'),
('Jane Smith', 'jane@example.com', '$2a$10$rQnM1vN.YdH5TqwL5CZn5eHqZB5vzDX5lIrUFKdNqE3lK5M5n5L5K'),
('Bob Wilson', 'bob@example.com', '$2a$10$rQnM1vN.YdH5TqwL5CZn5eHqZB5vzDX5lIrUFKdNqE3lK5M5n5L5K');

-- =====================================================
-- INSERT sample service providers
-- =====================================================
INSERT INTO service_providers (name, email, password, category, location, pincode) VALUES
('Mike Plumber', 'mike@plumber.com', '$2a$10$rQnM1vN.YdH5TqwL5CZn5eHqZB5vzDX5lIrUFKdNqE3lK5M5n5L5K', 'Plumbing', 'Ahmedabad, Gujarat', '380001'),
('Sarah Electric', 'sarah@electric.com', '$2a$10$rQnM1vN.YdH5TqwL5CZn5eHqZB5vzDX5lIrUFKdNqE3lK5M5n5L5K', 'Electrical', 'Ahmedabad, Gujarat', '382422'),
('Clean Pro Services', 'info@cleanpro.com', '$2a$10$rQnM1vN.YdH5TqwL5CZn5eHqZB5vzDX5lIrUFKdNqE3lK5M5n5L5K', 'Cleaning', 'Gandhinagar, Gujarat', '382010'),
('Home Painters Inc', 'contact@homepainters.com', '$2a$10$rQnM1vN.YdH5TqwL5CZn5eHqZB5vzDX5lIrUFKdNqE3lK5M5n5L5K', 'Painting', 'Ahmedabad, Gujarat', '380015'),
('AC Repair Pro', 'service@acrepair.com', '$2a$10$rQnM1vN.YdH5TqwL5CZn5eHqZB5vzDX5lIrUFKdNqE3lK5M5n5L5K', 'HVAC', 'Surat, Gujarat', '395001'),
('Raj Carpentry Works', 'raj@carpentry.com', '$2a$10$rQnM1vN.YdH5TqwL5CZn5eHqZB5vzDX5lIrUFKdNqE3lK5M5n5L5K', 'Carpentry', 'Vadodara, Gujarat', '390001'),
('Green Garden Services', 'info@greengarden.com', '$2a$10$rQnM1vN.YdH5TqwL5CZn5eHqZB5vzDX5lIrUFKdNqE3lK5M5n5L5K', 'Landscaping', 'Ahmedabad, Gujarat', '380054'),
('QuickShift Movers', 'support@quickshift.com', '$2a$10$rQnM1vN.YdH5TqwL5CZn5eHqZB5vzDX5lIrUFKdNqE3lK5M5n5L5K', 'Moving', 'Rajkot, Gujarat', '360001'),
('Aqua Plumbing Solutions', 'aqua@plumbing.com', '$2a$10$rQnM1vN.YdH5TqwL5CZn5eHqZB5vzDX5lIrUFKdNqE3lK5M5n5L5K', 'Plumbing', 'Surat, Gujarat', '395007'),
('PowerUp Electricals', 'hello@powerup.com', '$2a$10$rQnM1vN.YdH5TqwL5CZn5eHqZB5vzDX5lIrUFKdNqE3lK5M5n5L5K', 'Electrical', 'Gandhinagar, Gujarat', '382016');

-- =====================================================
-- INSERT sample services
-- =====================================================
INSERT INTO services (provider_id, service_name, price, category) VALUES
(1, 'Pipe Repair', 500.00, 'Plumbing'),
(1, 'Drain Cleaning', 350.00, 'Plumbing'),
(1, 'Water Heater Installation', 1500.00, 'Plumbing'),
(1, 'Tap Replacement', 250.00, 'Plumbing'),
(2, 'Electrical Wiring', 800.00, 'Electrical'),
(2, 'Light Fixture Installation', 300.00, 'Electrical'),
(2, 'Circuit Breaker Repair', 600.00, 'Electrical'),
(2, 'Ceiling Fan Installation', 400.00, 'Electrical'),
(3, 'House Deep Cleaning', 1200.00, 'Cleaning'),
(3, 'Office Cleaning', 1800.00, 'Cleaning'),
(3, 'Carpet Cleaning', 600.00, 'Cleaning'),
(3, 'Bathroom Sanitization', 500.00, 'Cleaning'),
(3, 'Kitchen Deep Clean', 800.00, 'Cleaning'),
(4, 'Interior Painting', 2500.00, 'Painting'),
(4, 'Exterior Painting', 4500.00, 'Painting'),
(4, 'Wall Texture', 1500.00, 'Painting'),
(4, 'Waterproof Coating', 2000.00, 'Painting'),
(5, 'AC Installation', 2500.00, 'HVAC'),
(5, 'AC Repair', 800.00, 'HVAC'),
(5, 'AC Maintenance', 500.00, 'HVAC'),
(5, 'AC Gas Refill', 1200.00, 'HVAC'),
(6, 'Furniture Repair', 700.00, 'Carpentry'),
(6, 'Custom Wardrobe', 8000.00, 'Carpentry'),
(6, 'Door Installation', 1500.00, 'Carpentry'),
(6, 'Kitchen Cabinet Making', 12000.00, 'Carpentry'),
(6, 'Wood Polishing', 2000.00, 'Carpentry'),
(7, 'Garden Maintenance', 1000.00, 'Landscaping'),
(7, 'Lawn Mowing', 500.00, 'Landscaping'),
(7, 'Tree Trimming', 800.00, 'Landscaping'),
(7, 'Landscape Design', 5000.00, 'Landscaping'),
(7, 'Irrigation System Setup', 3500.00, 'Landscaping'),
(8, 'Local House Shifting', 3000.00, 'Moving'),
(8, 'Office Relocation', 8000.00, 'Moving'),
(8, 'Packing & Unpacking', 2000.00, 'Moving'),
(8, 'Furniture Disassembly', 1500.00, 'Moving'),
(8, 'Vehicle Transport', 5000.00, 'Moving'),
(9, 'Toilet Repair', 400.00, 'Plumbing'),
(9, 'Water Tank Cleaning', 600.00, 'Plumbing'),
(9, 'Pipeline Fitting', 1200.00, 'Plumbing'),
(9, 'Leakage Detection', 300.00, 'Plumbing'),
(10, 'Inverter Installation', 1500.00, 'Electrical'),
(10, 'CCTV Installation', 3000.00, 'Electrical'),
(10, 'Switchboard Repair', 350.00, 'Electrical'),
(10, 'Generator Maintenance', 2000.00, 'Electrical');

-- =====================================================
-- INSERT sample bookings
-- =====================================================
INSERT INTO bookings (user_id, service_id, booking_date, status) VALUES
(1, 1, '2024-02-05', 'Completed'),
(1, 9, '2024-02-10', 'Accepted'),
(2, 5, '2024-02-08', 'Pending'),
(2, 14, '2024-02-15', 'Accepted'),
(3, 18, '2024-02-12', 'Completed'),
(1, 22, '2024-03-01', 'Pending'),
(2, 27, '2024-03-05', 'Accepted'),
(3, 33, '2024-03-10', 'Completed'),
(1, 38, '2024-03-15', 'Pending'),
(2, 42, '2024-03-18', 'Accepted');

-- =====================================================
-- INSERT sample reviews
-- =====================================================
INSERT INTO reviews (user_id, provider_id, rating, comment) VALUES
(1, 1, 5, 'Excellent service! Mike fixed our pipes quickly and professionally.'),
(3, 5, 4, 'Good AC installation. Professional team and fair pricing.'),
(1, 3, 5, 'Clean Pro did an amazing job with our house cleaning!'),
(2, 2, 4, 'Sarah Electric did great wiring work. Very neat and safe.'),
(3, 4, 5, 'Beautiful painting job! Our house looks brand new.'),
(1, 6, 4, 'Raj built a great wardrobe. Sturdy and well-finished.'),
(2, 7, 5, 'Our garden has never looked better! Highly recommended.'),
(3, 8, 3, 'Moving was smooth but took a bit longer than expected.'),
(1, 9, 4, 'Aqua Plumbing detected our leak fast. Very efficient.'),
(2, 10, 5, 'PowerUp installed our CCTV system perfectly. Great quality work.');

-- =====================================================
-- SAMPLE QUERIES FOR VIVA/DEMONSTRATION
-- =====================================================

-- Query 1: JOIN - Get all bookings with user and service details
-- SELECT b.id, u.name AS customer, s.service_name, sp.name AS provider, b.booking_date, b.status
-- FROM bookings b
-- JOIN users u ON b.user_id = u.id
-- JOIN services s ON b.service_id = s.id
-- JOIN service_providers sp ON s.provider_id = sp.id;

-- Query 2: Aggregate - Calculate average rating for each provider
-- SELECT sp.name, AVG(r.rating) AS avg_rating, COUNT(r.id) AS total_reviews
-- FROM service_providers sp
-- LEFT JOIN reviews r ON sp.id = r.provider_id
-- GROUP BY sp.id, sp.name;

-- Query 3: Filter - Get services by category
-- SELECT s.*, sp.name AS provider_name, sp.location
-- FROM services s
-- JOIN service_providers sp ON s.provider_id = sp.id
-- WHERE s.category = 'Plumbing';

-- Query 4: Subquery - Get providers with above average ratings
-- SELECT name, email FROM service_providers WHERE id IN (
--     SELECT provider_id FROM reviews GROUP BY provider_id
--     HAVING AVG(rating) > (SELECT AVG(rating) FROM reviews)
-- );
