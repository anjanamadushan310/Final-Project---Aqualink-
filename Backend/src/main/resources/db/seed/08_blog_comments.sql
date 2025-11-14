-- Seed Blog Comments

INSERT INTO blog_comments (id, blog_post_id, user_id, comment_text, created_at)
VALUES 
-- Comments on "Best Practices for Fish Farming"
(1, 1, 4, 'Great article! I''ve been following these practices on my farm and have seen significant improvement in yields.', NOW() - INTERVAL '9 days'),
(2, 1, 5, 'Very informative. Would love to see more content about disease prevention.', NOW() - INTERVAL '8 days'),
(3, 1, 15, 'As a new fish farmer, this article was exactly what I needed. Thank you!', NOW() - INTERVAL '7 days'),

-- Comments on "Export Quality Standards"
(4, 2, 4, 'HACCP certification was challenging but worth it. Our export volumes doubled after getting certified.', NOW() - INTERVAL '6 days'),
(5, 2, 7, 'Thanks for sharing this. The traceability requirements are particularly important in European markets.', NOW() - INTERVAL '5 days'),

-- Comments on "Setting Up Your First Aquarium"
(6, 3, 15, 'I just bought my first tank. This guide is so helpful!', NOW() - INTERVAL '4 days'),
(7, 3, 16, 'Quick question - can I add fish during the cycling process?', NOW() - INTERVAL '4 days'),
(8, 3, 8, 'Great question! It''s best to wait for the cycle to complete. Fish-in cycling can stress the fish.', NOW() - INTERVAL '3 days'),
(9, 3, 2, 'I wish I had read this before setting up my first tank. Would have saved me a lot of trouble!', NOW() - INTERVAL '3 days'),

-- Comments on "Sustainable Fishing Practices"
(10, 4, 6, 'Sustainability is not just good for the environment, it''s good for business long-term.', NOW() - INTERVAL '2 days'),
(11, 4, 5, 'We''ve implemented selective fishing gear and it has reduced our bycatch significantly.', NOW() - INTERVAL '2 days'),

-- Comments on "Common Fish Diseases"
(12, 5, 4, 'Ich was a nightmare for my farm last year. Prevention is definitely better than cure!', NOW() - INTERVAL '1 day'),
(13, 5, 8, 'As a service provider, I see these diseases regularly. Proper quarantine is so important.', NOW() - INTERVAL '1 day'),
(14, 5, 15, 'How long should the quarantine period be for new fish?', NOW() - INTERVAL '12 hours'),
(15, 5, 8, 'At least 2-4 weeks is recommended for quarantine. This gives time for any diseases to show symptoms.', NOW() - INTERVAL '6 hours');

-- Reset sequence
ALTER SEQUENCE blog_comments_id_seq RESTART WITH 16;
