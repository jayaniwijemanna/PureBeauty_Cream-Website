-- -----------------------------------------------------
-- Database schema for PureBeauty E-Commerce Website
-- Run this script in MySQL Workbench
-- -----------------------------------------------------

CREATE DATABASE IF NOT EXISTS `purebeauty`;
USE `purebeauty`;

-- Table for customer orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `address` TEXT NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `shipping_fee` DECIMAL(10,2) NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `status` ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table for order items (the specific creams bought in each order)
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `product_name` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional: Insert a dummy order for testing the Admin Panel
INSERT INTO `orders` (`full_name`, `address`, `phone`, `payment_method`, `subtotal`, `shipping_fee`, `total`, `status`) 
VALUES 
('Nimal Perera', '123 Galle Road, Colombo', '0771234567', 'Cash on Delivery', 5490.00, 500.00, 5990.00, 'Pending'),
('Sunimal Jayasuriya', '45 Kandy Road, Kandy', '0719876543', 'Bank Transfer', 11780.00, 500.00, 12280.00, 'Shipped');

INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `price`, `quantity`) 
VALUES 
(1, 'prod_1', 'Signature Radiance Cream', 5490.00, 1),
(2, 'prod_6', 'Vitamin C Brightener', 5890.00, 2);
