-- Seed Services (Service Providers)

INSERT INTO services (id, name, description, nic_number, price, create_date_and_time, active_status, user_id)
VALUES 
-- Services from Ravi (user_id 8)
(1, 'Aquarium Setup & Installation', 'Professional aquarium setup service including tank, filtration, lighting, and decoration. We handle everything from delivery to installation and initial fish stocking.', '200212345678', 25000.00, NOW(), 'APPROVED', 8),
(2, 'Aquarium Maintenance - Monthly', 'Regular monthly maintenance service including water changes, filter cleaning, algae removal, and health checkups.', '200212345678', 3500.00, NOW(), 'APPROVED', 8),
(3, 'Fish Disease Treatment', 'Expert diagnosis and treatment of fish diseases. Includes consultation and medication.', '200212345678', 5000.00, NOW(), 'APPROVED', 8),

-- Services from Anjana (user_id 9)
(4, 'Fish Farm Consultation', 'Professional consultation for starting or improving fish farming operations. Includes site visit and detailed report.', '200312345678', 15000.00, NOW(), 'APPROVED', 9),
(5, 'Pond Construction Service', 'Complete pond construction service including excavation, lining, and plumbing setup.', '200312345678', 150000.00, NOW(), 'APPROVED', 9),
(6, 'Fish Farming Training Program', 'Comprehensive 2-day training program on modern fish farming techniques and best practices.', '200312345678', 8000.00, NOW(), 'APPROVED', 9),
(7, 'Water Quality Management', 'Water quality testing and management service. Includes testing, analysis, and recommendations.', '200312345678', 6500.00, NOW(), 'APPROVED', 9),

-- Additional services from Ravi
(8, 'Emergency Fish Care', '24/7 emergency fish care service for critical situations. Call-out service.', '200212345678', 7500.00, NOW(), 'APPROVED', 8),
(9, 'Custom Aquarium Design', 'Custom aquarium design service for homes and offices. Includes 3D visualization.', '200212345678', 12000.00, NOW(), 'APPROVED', 8);

-- Reset sequence
ALTER SEQUENCE services_id_seq RESTART WITH 10;
