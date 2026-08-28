CREATE TABLE `articles` (
	`id` varchar(64) NOT NULL,
	`ownerId` varchar(64) NOT NULL,
	`author` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text NOT NULL,
	`category` varchar(120) NOT NULL,
	`status` enum('Rascunho','Publicado') NOT NULL DEFAULT 'Rascunho',
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`)
);
