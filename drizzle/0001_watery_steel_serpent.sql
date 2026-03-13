CREATE TABLE `auditResponses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`auditId` int NOT NULL,
	`responseType` enum('viewed','downloaded','inquiry','conversion') NOT NULL,
	`responseData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditResponses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`companyEmail` varchar(320) NOT NULL,
	`companyPhone` varchar(20),
	`companyWebsite` varchar(500),
	`industry` varchar(100),
	`status` enum('pending','in_progress','completed','delivered') NOT NULL DEFAULT 'pending',
	`auditType` enum('basic','authority_engine','ongoing') NOT NULL DEFAULT 'basic',
	`findings` text,
	`recommendations` text,
	`price` int,
	`paid` int DEFAULT 0,
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `audits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`website` varchar(500),
	`industry` varchar(100),
	`employees` int,
	`annualRevenue` varchar(50),
	`contactPerson` varchar(255),
	`status` enum('prospect','lead','client','inactive') NOT NULL DEFAULT 'prospect',
	`notes` text,
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`duration` varchar(50),
	`features` text,
	`active` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
