CREATE TABLE "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"task_category_id" text,
	"task_priority_id" text,
	"title" varchar NOT NULL,
	"description" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "task_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tasks_priority" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_task_category_id_task_categories_id_fk" FOREIGN KEY ("task_category_id") REFERENCES "public"."task_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_task_priority_id_tasks_priority_id_fk" FOREIGN KEY ("task_priority_id") REFERENCES "public"."tasks_priority"("id") ON DELETE no action ON UPDATE no action;