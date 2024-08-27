DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('Unverified', 'Verified', 'Banned');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "decentralizations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "decentralizations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email_author" varchar(100),
	"role_name" varchar(50)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "refreshToken" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "refreshToken_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"refresh_token" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"email" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"role_name" varchar(50) PRIMARY KEY NOT NULL,
	"role_utf8" varchar(50),
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"email" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(50),
	"password" text,
	"date_of_birth" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"email_verified_token" text,
	"forgot_password_token" text,
	"avatar" text,
	"type" "type"
);
