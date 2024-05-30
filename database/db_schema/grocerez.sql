/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE IF NOT EXISTS `user` (
  `usr_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `usr_name` varchar(50) NOT NULL,
  `usr_email` varchar(50) NOT NULL,
  `usr_salt` varchar(50) NOT NULL,
  `usr_password` varchar(255) NOT NULL,
  PRIMARY KEY (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `user`;
INSERT INTO `user` (`usr_id`, `usr_name`, `usr_email`, `usr_salt`, `usr_password`) VALUES
	(1, 'User', 'user@gmail.com', '1a418a742da02cfe16de', '0232c36920a0fd08a3d0044a277e1848322dbe75b64d5cade44b37ffc1bf6d8fe6e0aac060aada1328378451758d467c0ffe64c3e790d35f94f18a513234cb7f'),
	(2, 'Erin', 'etgrouge@ncsu.edu', '3a76ca4c8bf2a46f3f34', '6cbe566b559866dd888ffcbffeb6b85a43bf359e75babd901afc878fbb542c0bc222f743590eb82a8992367ad59561f4151b9b478751e9b131068d01d00a7f6c'),
	(3, 'Jamel', 'jjclark4@ncsu.edu', 'c7ae764aa52eb0d4fee2', '181fa9e73e6fa7ac7a20d45a5ab6a98ee595bf4390cf76a04d1cc90d3724d5b838be7e638ccf635002b82ab8da01b3e62cbe4fb250e1049c2de1c1fc87fc214e'),
	(4, 'Bennett', 'bcflemin@ncsu.edu', '8c8c5dff611118a25032', 'b3541571c1406270174c84a9f918cd5bff1a7ccf2be01eed3cb37ce8d526637839615d3d55cf672caff956f11b2f6ecbe1869a731fe37f51b48d7b9df4f2da5c');


CREATE TABLE IF NOT EXISTS `item` (
  `it_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `it_name` varchar(50) NOT NULL,
  `it_qt` varchar(20) NOT NULL,
  PRIMARY KEY (`it_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `item`;
INSERT INTO `item` (`it_id`, `it_name`, `it_qt`) VALUES
	(1, 'Apples', '1 bag'),
	(2, 'Bananas', '1 bunch'),
	(3, 'Cups', '12'),
	(4, 'Shampoo', '2 bottles'),
	(5, 'Ground Beef', '1 pound'),
	(6, 'Rice', '1 pound bag'),
	(7, 'Trash Bags', '1 roll'),
	(8, 'Broccoli', '2 heads'),
	(9, 'Bread', '2 loafs'),
	(10, 'Milk', '1 gallon'),
	(11, 'Ham', '1/2 pound'),
	(12, 'Chocolate', '1 bar'),
	(13, 'Milk', '1 cup'),
	(14, 'Apples', '1 apple'),
	(15, 'Bananas', '1 banana'),
	(16, 'Bread', '2 slices'),
	(17, 'Ham', '3 slices'),
	(18, 'Soup Can', '1 can'),
	(19, 'Ground Beef', '1 pound'),
	(20, 'Rice', '1 cup'),
	(21, 'Broccoli', '1 head'),
	(22, 'Cups', '12'),
	(23, 'Shampoo', '2 bottles'),
	(24, 'Trash Bags', '1 roll'),
	(25, 'Rice', '1 pound bag'),
	(26, 'Broccoli', '2 heads');

CREATE TABLE IF NOT EXISTS `user_item` (
  `uit_usr_id` int(11) unsigned NOT NULL,
  `uit_it_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`uit_usr_id`,`uit_it_id`),
  KEY `FK_UIT_IT` (`uit_it_id`),
  CONSTRAINT `FK_UIT_IT` FOREIGN KEY (`uit_it_id`) REFERENCES `item` (`it_id`),
  CONSTRAINT `FK_UIT_USR` FOREIGN KEY (`uit_usr_id`) REFERENCES `user` (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `user_item`;
INSERT INTO `user_item` (`uit_usr_id`, `uit_it_id`) VALUES
	(1, 1),
	(1, 2),
	(1, 3),
	(1, 4),
	(1, 5),
	(1, 6),
	(1, 7),
	(1, 8),
	(1, 9),
	(1, 10),
	(1, 11),
	(2, 12),
	(1, 13),
	(1, 14),
	(1, 15),
	(1, 16),
	(1, 17),
	(2, 18),
	(1, 19),
	(1, 20),
	(1, 21),
	(1, 22),
	(1, 23),
	(1, 24),
	(1, 25),
	(1, 26);

CREATE TABLE IF NOT EXISTS `recipe` (
  `rec_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `rec_name` varchar(50) NOT NULL,
  `rec_cat` varchar(20) NOT NULL,
  PRIMARY KEY (`rec_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `recipe`;
INSERT INTO `recipe` (`rec_id`, `rec_name`, `rec_cat`) VALUES
	(1, 'Beef and Broccoli', 'dinner'),
	(2, 'Smoothie', 'breakfast'),
	(3, 'Ham Sammich', 'lunch'),
	(4, 'Chicken Noodle Soup', 'dinner');

CREATE TABLE IF NOT EXISTS `user_recipe` (
  `ure_usr_id` int(11) unsigned NOT NULL,
  `ure_rec_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`ure_usr_id`,`ure_rec_id`),
  KEY `FK_URE_REC` (`ure_rec_id`),
  CONSTRAINT `FK_URE_REC` FOREIGN KEY (`ure_rec_id`) REFERENCES `recipe` (`rec_id`),
  CONSTRAINT `FK_URE_USR` FOREIGN KEY (`ure_usr_id`) REFERENCES `user` (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `user_recipe`;
INSERT INTO `user_recipe` (`ure_usr_id`, `ure_rec_id`) VALUES
	(1, 1),
	(1, 2),
	(1, 3),
	(2, 4);

CREATE TABLE IF NOT EXISTS `recipe_item` (
  `rei_rec_id` int(11) unsigned NOT NULL,
  `rei_it_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`rei_rec_id`,`rei_it_id`),
  KEY `FK_REI_REC` (`rei_rec_id`),
  CONSTRAINT `FK_REI_REC` FOREIGN KEY (`rei_rec_id`) REFERENCES `recipe` (`rec_id`),
  CONSTRAINT `FK_REI_IT` FOREIGN KEY (`rei_it_id`) REFERENCES `item` (`it_id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `recipe_item`;
INSERT INTO `recipe_item` (`rei_rec_id`, `rei_it_id`) VALUES
	(1, 19),
	(1, 20),
	(1, 21),
	(2, 13),
	(2, 14),
	(2, 15),
	(3, 16),
	(3, 17);

CREATE TABLE IF NOT EXISTS `list` (
  `lis_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `lis_name` varchar(50) NOT NULL,
  PRIMARY KEY (`lis_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `list`;
INSERT INTO `list` (`lis_id`, `lis_name`) VALUES
	(1, 'Current'),
	(2, 'Items'),
	(3, 'Essentials'),
	(4, 'Non Food Items'),	
	(5, 'Current'),
	(6, 'Items'),
	(7, 'Summer'),
	(8, 'Current'),
	(9, 'Items'),
	(10, 'Current'),
	(11, 'Items');

	
CREATE TABLE IF NOT EXISTS `user_list` (
  `ul_usr_id` int(11) unsigned NOT NULL,
  `ul_lis_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`ul_usr_id`,`ul_lis_id`),
  KEY `FK_UL_LIS` (`ul_lis_id`),
  CONSTRAINT `FK_UL_LIS` FOREIGN KEY (`ul_lis_id`) REFERENCES `list` (`lis_id`),
  CONSTRAINT `FK_UL_USR` FOREIGN KEY (`ul_usr_id`) REFERENCES `user` (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `user_list`;
INSERT INTO `user_list` (`ul_usr_id`, `ul_lis_id`) VALUES
	(1, 1),
	(1, 2),
	(1, 3),
	(1, 4),
	(2, 5),
	(2, 6),
	(2, 7),
	(3, 8),
	(3, 9),
	(4, 10),
	(4, 11);

CREATE TABLE IF NOT EXISTS `list_item` (
  `lit_lis_id` int(11) unsigned NOT NULL,
  `lit_it_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`lit_lis_id`,`lit_it_id`),
  KEY `FK_LIT_LIS` (`lit_lis_id`),
  CONSTRAINT `FK_LIT_LIS` FOREIGN KEY (`lit_lis_id`) REFERENCES `list` (`lis_id`),
  CONSTRAINT `FK_LIT_IT` FOREIGN KEY (`lit_it_id`) REFERENCES `item` (`it_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `list_item`;
INSERT INTO `list_item` (`lit_lis_id`, `lit_it_id`) VALUES
	(1, 1),
	(1, 2),
	(2, 3),
	(2, 4),
	(2, 5),
	(2, 6),
	(2, 7),
	(2, 8),
	(2, 9),
	(2, 10),
	(2, 11),
	(4, 22),
	(4, 23),
	(4, 24),
	(3, 25),
	(3, 26),
	(6, 12),
	(6, 18);


/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
