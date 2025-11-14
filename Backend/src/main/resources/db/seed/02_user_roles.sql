-- Seed User Roles
-- Assign roles to users created in 01_users.sql

-- Admin role
INSERT INTO user_roles (user_id, role_name) VALUES (1, 'ADMIN');

-- Shop Owners
INSERT INTO user_roles (user_id, role_name) VALUES (2, 'SHOP_OWNER');
INSERT INTO user_roles (user_id, role_name) VALUES (3, 'SHOP_OWNER');

-- Farm Owners
INSERT INTO user_roles (user_id, role_name) VALUES (4, 'FARM_OWNER');
INSERT INTO user_roles (user_id, role_name) VALUES (5, 'FARM_OWNER');

-- Exporters
INSERT INTO user_roles (user_id, role_name) VALUES (6, 'EXPORTER');
INSERT INTO user_roles (user_id, role_name) VALUES (7, 'EXPORTER');

-- Service Providers
INSERT INTO user_roles (user_id, role_name) VALUES (8, 'SERVICE_PROVIDER');
INSERT INTO user_roles (user_id, role_name) VALUES (9, 'SERVICE_PROVIDER');

-- Industrial Stuff Sellers
INSERT INTO user_roles (user_id, role_name) VALUES (10, 'INDUSTRIAL_STUFF_SELLER');
INSERT INTO user_roles (user_id, role_name) VALUES (11, 'INDUSTRIAL_STUFF_SELLER');

-- Delivery Persons
INSERT INTO user_roles (user_id, role_name) VALUES (12, 'DELIVERY_PERSON');
INSERT INTO user_roles (user_id, role_name) VALUES (13, 'DELIVERY_PERSON');
INSERT INTO user_roles (user_id, role_name) VALUES (14, 'DELIVERY_PERSON');

-- Some users with multiple roles (for testing)
INSERT INTO user_roles (user_id, role_name) VALUES (4, 'EXPORTER'); -- Farm owner who also exports
INSERT INTO user_roles (user_id, role_name) VALUES (2, 'SERVICE_PROVIDER'); -- Shop owner who also provides services
