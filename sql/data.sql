-- Sample seed data
INSERT INTO trainers (name, specialty, bio, photo_url) VALUES
('Ava Stone','Strength Coach','Expert in Olympic lifting and hypertrophy','/assets/trainer1.jpg'),
('Liam Fox','Cardio Specialist','Endurance and HIIT coach','/assets/trainer2.jpg');

INSERT INTO classes (title, description, schedule, capacity, price, trainer_id) VALUES
('Bootcamp','High intensity interval training','Sat 08:00',30,10.0,1),
('Yoga Flow','Mobility and recovery','Sun 09:30',20,8.0,2);

INSERT INTO payments (member_id, amount, currency, status, created_at) VALUES
(1,19.99,'INR','COMPLETED',NOW());


