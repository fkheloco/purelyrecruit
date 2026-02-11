CREATE TYPE "public"."user_role" AS ENUM('platform_admin', 'recruiter', 'client_admin', 'client_user', 'candidate');--> statement-breakpoint
CREATE TYPE "public"."skill_category" AS ENUM('software', 'hard_skill', 'soft_skill', 'certificate');--> statement-breakpoint
CREATE TYPE "public"."availability" AS ENUM('immediate', 'two_weeks', 'one_month', 'three_months', 'not_looking');--> statement-breakpoint
CREATE TYPE "public"."proficiency" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');--> statement-breakpoint
CREATE TYPE "public"."employment_type" AS ENUM('full_time', 'part_time', 'contract', 'temp', 'intern');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('draft', 'active', 'paused', 'closed', 'filled');--> statement-breakpoint
CREATE TYPE "public"."location_type" AS ENUM('onsite', 'remote', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."importance" AS ENUM('mandatory', 'required', 'optional');--> statement-breakpoint
CREATE TYPE "public"."application_source" AS ENUM('direct_apply', 'job_board', 'talent_pool_match', 'recruiter_suggested', 'referral', 'ai_matched');--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('new', 'ai_processing', 'scored', 'reviewed', 'shortlisted', 'interviewing', 'offered', 'hired', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."note_visibility" AS ENUM('internal', 'client', 'candidate');--> statement-breakpoint
CREATE TYPE "public"."message_channel" AS ENUM('in_app', 'email', 'sms');--> statement-breakpoint
CREATE TYPE "public"."job_queue_status" AS ENUM('pending', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_org_id" varchar NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"logo_url" text,
	"primary_color" varchar(7) DEFAULT '#455E7F',
	"accent_color" varchar(7) DEFAULT '#D7A839',
	"custom_domain" varchar(255),
	"website" text,
	"description" text,
	"industry" varchar(100),
	"notification_defaults" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_clerk_org_id_unique" UNIQUE("clerk_org_id"),
	CONSTRAINT "tenants_slug_unique" UNIQUE("slug"),
	CONSTRAINT "tenants_custom_domain_unique" UNIQUE("custom_domain")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"role" "user_role" DEFAULT 'candidate' NOT NULL,
	"tenant_id" uuid,
	"avatar_url" text,
	"phone" varchar(50),
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" "skill_category" NOT NULL,
	"subcategory" varchar(255),
	"aliases" text[],
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"phone" varchar(50),
	"location_city" varchar(100),
	"location_state" varchar(50),
	"location_country" varchar(50) DEFAULT 'US',
	"linkedin_url" text,
	"portfolio_url" text,
	"years_experience" integer,
	"current_title" varchar(255),
	"current_company" varchar(255),
	"desired_titles" text[],
	"desired_industries" text[],
	"desired_locations" text[],
	"salary_expectation_min" integer,
	"salary_expectation_max" integer,
	"availability" "availability" DEFAULT 'not_looking',
	"talent_score" real DEFAULT 0,
	"enrichment_data" jsonb DEFAULT '{}'::jsonb,
	"source" varchar(100),
	"bio" text,
	"is_profile_public" boolean DEFAULT true,
	"search_vector" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resumes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"file_url" text NOT NULL,
	"file_name" varchar(500) NOT NULL,
	"file_type" varchar(100) DEFAULT 'application/pdf',
	"file_size" varchar(50),
	"parsed_data" jsonb DEFAULT '{}'::jsonb,
	"parsed_skills" text[],
	"parsed_experience" jsonb DEFAULT '[]'::jsonb,
	"parsed_education" jsonb DEFAULT '[]'::jsonb,
	"parsed_certifications" text[],
	"raw_text" text,
	"is_primary" boolean DEFAULT false,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidate_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"proficiency" "proficiency",
	"years_experience" integer,
	"source" varchar(50) DEFAULT 'parsed'
);
--> statement-breakpoint
CREATE TABLE "job_openings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"title" varchar(500) NOT NULL,
	"department" varchar(255),
	"location_city" varchar(100),
	"location_state" varchar(50),
	"location_type" "location_type" DEFAULT 'onsite',
	"employment_type" "employment_type" DEFAULT 'full_time',
	"salary_min" integer,
	"salary_max" integer,
	"description" text,
	"requirements" text,
	"good_indicators" text[],
	"bad_indicators" text[],
	"status" "job_status" DEFAULT 'draft' NOT NULL,
	"published_boards" text[],
	"external_ids" jsonb DEFAULT '{}'::jsonb,
	"search_vector" text,
	"created_by" uuid,
	"assigned_recruiter" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"closes_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "job_skill_requirements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_opening_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"importance" "importance" NOT NULL,
	"min_years" integer,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"job_opening_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"resume_id" uuid,
	"status" "application_status" DEFAULT 'new' NOT NULL,
	"source" "application_source" DEFAULT 'direct_apply',
	"score_module_1" real,
	"score_module_2" real,
	"score_module_3" real,
	"final_score" real,
	"weighted_score" real,
	"missing_mandatory_count" integer DEFAULT 0,
	"missing_mandatory_details" text,
	"ai_recommendation" varchar(50),
	"ai_notes" text,
	"ai_alt_position" text,
	"ai_full_report" text,
	"ai_processed_at" timestamp,
	"recruiter_score" real,
	"recruiter_notes" text,
	"recruiter_decision" varchar(100),
	"reviewed_by" uuid,
	"reviewed_at" timestamp,
	"client_rating" integer,
	"client_feedback" text,
	"client_decision" varchar(100),
	"applied_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scoring_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"module_1_weight" real DEFAULT 0.4 NOT NULL,
	"module_2_weight" real DEFAULT 0.3 NOT NULL,
	"module_3_weight" real DEFAULT 0.3 NOT NULL,
	"mandatory_skill_penalty" real DEFAULT -10,
	"good_indicator_bonus" real DEFAULT 10,
	"bad_indicator_penalty" real DEFAULT -10,
	"custom_weights" jsonb DEFAULT '{}'::jsonb,
	"updated_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "scoring_configs_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid,
	"application_id" uuid,
	"tenant_id" uuid,
	"author_id" uuid NOT NULL,
	"author_role" varchar(50) NOT NULL,
	"content" text NOT NULL,
	"visibility" "note_visibility" DEFAULT 'internal' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid,
	"sender_id" uuid NOT NULL,
	"recipient_id" uuid,
	"tenant_id" uuid,
	"candidate_id" uuid,
	"application_id" uuid,
	"subject" varchar(500),
	"body" text NOT NULL,
	"sent_on_behalf_of" varchar(50),
	"channel" "message_channel" DEFAULT 'in_app',
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tenant_id" uuid,
	"type" varchar(100) NOT NULL,
	"title" varchar(500) NOT NULL,
	"body" text,
	"reference_type" varchar(50),
	"reference_id" uuid,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_queue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(100) NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb,
	"status" "job_queue_status" DEFAULT 'pending' NOT NULL,
	"retries" integer DEFAULT 0,
	"max_retries" integer DEFAULT 3,
	"next_run_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reporting_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid,
	"period_type" varchar(20) NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"metrics" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidate_embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"resume_text" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_opening_id" uuid NOT NULL,
	"description_text" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_skills" ADD CONSTRAINT "candidate_skills_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_skills" ADD CONSTRAINT "candidate_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_openings" ADD CONSTRAINT "job_openings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_openings" ADD CONSTRAINT "job_openings_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_openings" ADD CONSTRAINT "job_openings_assigned_recruiter_users_id_fk" FOREIGN KEY ("assigned_recruiter") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_skill_requirements" ADD CONSTRAINT "job_skill_requirements_job_opening_id_job_openings_id_fk" FOREIGN KEY ("job_opening_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_skill_requirements" ADD CONSTRAINT "job_skill_requirements_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_opening_id_job_openings_id_fk" FOREIGN KEY ("job_opening_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scoring_configs" ADD CONSTRAINT "scoring_configs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scoring_configs" ADD CONSTRAINT "scoring_configs_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reporting_snapshots" ADD CONSTRAINT "reporting_snapshots_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_embeddings" ADD CONSTRAINT "candidate_embeddings_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_embeddings" ADD CONSTRAINT "job_embeddings_job_opening_id_job_openings_id_fk" FOREIGN KEY ("job_opening_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;