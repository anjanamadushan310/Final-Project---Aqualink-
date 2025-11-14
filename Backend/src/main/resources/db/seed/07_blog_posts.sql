-- Seed Blog Posts (Exporters sharing knowledge)

INSERT INTO blog_posts (id, title, content, author_id, created_at, updated_at, published, views, image_url)
VALUES 
(1, 'Best Practices for Fish Farming in Sri Lanka', 
'<h2>Introduction to Modern Fish Farming</h2>
<p>Fish farming in Sri Lanka has evolved significantly over the past decade. With increasing demand for fresh fish and declining wild fish stocks, aquaculture has become a vital industry.</p>
<h3>Key Success Factors</h3>
<ul>
<li>Water quality management</li>
<li>Proper feeding schedules</li>
<li>Disease prevention</li>
<li>Market timing</li>
</ul>
<p>In this comprehensive guide, we will explore the best practices that successful fish farmers follow to maximize their yields and profits.</p>',
6, NOW() - INTERVAL ''10 days'', NOW() - INTERVAL ''10 days'', true, 245, NULL),

(2, 'Export Quality Standards for Seafood',
'<h2>Understanding International Seafood Standards</h2>
<p>Exporting seafood requires strict adherence to international quality and safety standards. This article covers the essential requirements for successful seafood export.</p>
<h3>Key Requirements</h3>
<ul>
<li>HACCP Certification</li>
<li>Temperature control</li>
<li>Traceability systems</li>
<li>Packaging standards</li>
</ul>
<p>Learn how to prepare your products for the international market and meet buyer expectations.</p>',
6, NOW() - INTERVAL ''8 days'', NOW() - INTERVAL ''7 days'', true, 189, NULL),

(3, 'Setting Up Your First Aquarium: A Beginner''s Guide',
'<h2>Welcome to the World of Aquariums!</h2>
<p>Starting your first aquarium can be an exciting journey. This guide will walk you through everything you need to know.</p>
<h3>Essential Equipment</h3>
<ol>
<li>Aquarium tank (minimum 20 gallons for beginners)</li>
<li>Filtration system</li>
<li>Heater (for tropical fish)</li>
<li>LED lighting</li>
<li>Water testing kit</li>
</ol>
<h3>The Nitrogen Cycle</h3>
<p>Before adding fish, it is crucial to establish the nitrogen cycle in your tank. This process typically takes 4-6 weeks.</p>',
7, NOW() - INTERVAL ''5 days'', NOW() - INTERVAL ''5 days'', true, 312, NULL),

(4, 'Sustainable Fishing Practices for the Future',
'<h2>The Importance of Sustainability</h2>
<p>As the global demand for seafood continues to rise, sustainable fishing practices have never been more important.</p>
<p>This article explores methods and technologies that help preserve marine ecosystems while maintaining profitable fishing operations.</p>
<h3>Key Sustainable Practices</h3>
<ul>
<li>Selective fishing gear</li>
<li>Quota management</li>
<li>Habitat protection</li>
<li>Bycatch reduction</li>
</ul>',
6, NOW() - INTERVAL ''3 days'', NOW() - INTERVAL ''3 days'', true, 156, NULL),

(5, 'Common Fish Diseases and How to Prevent Them',
'<h2>Fish Health Management</h2>
<p>Preventing fish diseases is far more effective than treating them. Understanding common diseases and their prevention is essential for every fish farmer.</p>
<h3>Most Common Diseases</h3>
<ul>
<li>Ich (White Spot Disease)</li>
<li>Fin Rot</li>
<li>Columnaris</li>
<li>Dropsy</li>
</ul>
<h3>Prevention Strategies</h3>
<p>Maintaining excellent water quality, proper nutrition, and quarantine procedures are your first line of defense against fish diseases.</p>',
7, NOW() - INTERVAL ''2 days'', NOW() - INTERVAL ''2 days'', true, 98, NULL);

-- Reset sequence
ALTER SEQUENCE blog_posts_id_seq RESTART WITH 6;
