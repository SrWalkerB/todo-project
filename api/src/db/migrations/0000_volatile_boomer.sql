CREATE TABLE "todos" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
