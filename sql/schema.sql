-- Schema for gym management
CREATE TABLE members (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  username VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(20),
  membership_type VARCHAR(100),
  role VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trainers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  specialty VARCHAR(255),
  bio TEXT,
  photo_url VARCHAR(512)
);

CREATE TABLE classes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  schedule VARCHAR(255),
  capacity INT,
  price DOUBLE,
  trainer_id BIGINT,
  CONSTRAINT fk_class_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id)
);

CREATE TABLE bookings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  member_id BIGINT,
  class_id BIGINT,
  booked_at DATETIME,
  status VARCHAR(100),
  CONSTRAINT fk_booking_member FOREIGN KEY (member_id) REFERENCES members(id),
  CONSTRAINT fk_booking_class FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE payments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  member_id BIGINT,
  amount DOUBLE,
  currency VARCHAR(10),
  status VARCHAR(50),
  created_at DATETIME,
  CONSTRAINT fk_payment_member FOREIGN KEY (member_id) REFERENCES members(id)
);


