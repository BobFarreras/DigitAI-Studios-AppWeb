
\restrict YvFgoMILroBpTczgfgVixbGvDCxOe8JNOFNgM5VO3j28dqBrgJOHrmMD7z02dul


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."audit_status" AS ENUM (
    'processing',
    'completed',
    'failed'
);


ALTER TYPE "public"."audit_status" OWNER TO "postgres";


CREATE TYPE "public"."content_status" AS ENUM (
    'queued',
    'generating',
    'review',
    'published'
);


ALTER TYPE "public"."content_status" OWNER TO "postgres";


CREATE TYPE "public"."post_status" AS ENUM (
    'draft',
    'published',
    'archived'
);


ALTER TYPE "public"."post_status" OWNER TO "postgres";


CREATE TYPE "public"."project_status" AS ENUM (
    'pending',
    'active',
    'maintenance',
    'archived'
);


ALTER TYPE "public"."project_status" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'admin',
    'client',
    'lead'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  assigned_role text;
begin
  -- Si el correu coincideix amb el teu d'admin, li posem rol 'admin' directament
  if new.email = 'digitaistudios.developer@gmail.com' then
    assigned_role := 'admin';
  else
    assigned_role := 'lead';
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    assigned_role
  );
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  select exists (
    select 1 
    from public.profiles 
    where id = auth.uid() 
    and role = 'admin'
  );
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."analytics_events" (
    "id" bigint NOT NULL,
    "session_id" "text" NOT NULL,
    "event_name" "text" NOT NULL,
    "path" "text",
    "meta" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "country" "text",
    "city" "text",
    "device_type" "text",
    "browser" "text",
    "os" "text",
    "referrer" "text",
    "duration_seconds" integer DEFAULT 0
);


ALTER TABLE "public"."analytics_events" OWNER TO "postgres";


ALTER TABLE "public"."analytics_events" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."analytics_events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."analytics_visitors" (
    "visitor_id" "text" NOT NULL,
    "first_seen_at" timestamp with time zone DEFAULT "now"(),
    "last_seen_at" timestamp with time zone DEFAULT "now"(),
    "device_type" "text",
    "country" "text",
    "referrer" "text"
);


ALTER TABLE "public"."analytics_visitors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contact_leads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "full_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "service" "text" NOT NULL,
    "message" "text" NOT NULL,
    "source" "text" DEFAULT 'landing_contact_form'::"text"
);


ALTER TABLE "public"."contact_leads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_queue" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "topic" "text" NOT NULL,
    "target_keywords" "text"[],
    "prompt_context" "text",
    "status" "public"."content_status" DEFAULT 'queued'::"public"."content_status",
    "generated_mdx" "text",
    "image_prompt" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."content_queue" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "cover_image" "text",
    "content_mdx" "text",
    "tags" "text"[],
    "status" "public"."post_status" DEFAULT 'draft'::"public"."post_status",
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "published" boolean DEFAULT false
);


ALTER TABLE "public"."posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "role" "public"."user_role" DEFAULT 'lead'::"public"."user_role",
    "stripe_customer_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "client_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "domain" "text",
    "status" "public"."project_status" DEFAULT 'pending'::"public"."project_status",
    "repository_url" "text",
    "hosting_url" "text",
    "features_enabled" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."web_audits" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "url" "text" NOT NULL,
    "visitor_id" "text",
    "user_id" "uuid",
    "status" "public"."audit_status" DEFAULT 'processing'::"public"."audit_status",
    "seo_score" integer,
    "performance_score" integer,
    "report_data" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "email" "text"
);


ALTER TABLE "public"."web_audits" OWNER TO "postgres";


ALTER TABLE ONLY "public"."analytics_events"
    ADD CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."analytics_visitors"
    ADD CONSTRAINT "analytics_visitors_pkey" PRIMARY KEY ("visitor_id");



ALTER TABLE ONLY "public"."contact_leads"
    ADD CONSTRAINT "contact_leads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content_queue"
    ADD CONSTRAINT "content_queue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."web_audits"
    ADD CONSTRAINT "web_audits_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_analytics_country" ON "public"."analytics_events" USING "btree" ("country");



CREATE INDEX "idx_analytics_device" ON "public"."analytics_events" USING "btree" ("device_type");



CREATE INDEX "idx_analytics_name" ON "public"."analytics_events" USING "btree" ("event_name");



CREATE INDEX "idx_analytics_session" ON "public"."analytics_events" USING "btree" ("session_id");



CREATE INDEX "idx_analytics_time" ON "public"."analytics_events" USING "btree" ("created_at" DESC);



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."web_audits"
    ADD CONSTRAINT "web_audits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



CREATE POLICY "Admin Select Only" ON "public"."analytics_events" FOR SELECT TO "authenticated" USING ((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = 'digitaistudios.developer@gmail.com'::"text"));



CREATE POLICY "Admins can view all profiles" ON "public"."profiles" FOR SELECT USING (("public"."is_admin"() = true));



CREATE POLICY "Enable insert for everyone" ON "public"."analytics_events" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable insert for everyone" ON "public"."contact_leads" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable insert for visitors" ON "public"."analytics_visitors" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable read for everyone" ON "public"."analytics_visitors" FOR SELECT USING (true);



CREATE POLICY "Enable select for admins only" ON "public"."analytics_events" FOR SELECT TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") = 'digitaistudios.developer@gmail.com'::"text"));



CREATE POLICY "Owner Read Policy" ON "public"."web_audits" FOR SELECT TO "authenticated" USING (("email" = ( SELECT ("auth"."jwt"() ->> 'email'::"text"))));



CREATE POLICY "Public Insert Policy" ON "public"."web_audits" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public can read published posts" ON "public"."posts" FOR SELECT USING (("status" = 'published'::"public"."post_status"));



CREATE POLICY "Public can track" ON "public"."analytics_events" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert their own audits" ON "public"."web_audits" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own audits" ON "public"."web_audits" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own audits" ON "public"."web_audits" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."analytics_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."analytics_visitors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contact_leads" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."web_audits" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON TABLE "public"."analytics_events" TO "anon";
GRANT ALL ON TABLE "public"."analytics_events" TO "authenticated";
GRANT ALL ON TABLE "public"."analytics_events" TO "service_role";



GRANT ALL ON SEQUENCE "public"."analytics_events_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."analytics_events_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."analytics_events_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."analytics_visitors" TO "anon";
GRANT ALL ON TABLE "public"."analytics_visitors" TO "authenticated";
GRANT ALL ON TABLE "public"."analytics_visitors" TO "service_role";



GRANT ALL ON TABLE "public"."contact_leads" TO "anon";
GRANT ALL ON TABLE "public"."contact_leads" TO "authenticated";
GRANT ALL ON TABLE "public"."contact_leads" TO "service_role";



GRANT ALL ON TABLE "public"."content_queue" TO "anon";
GRANT ALL ON TABLE "public"."content_queue" TO "authenticated";
GRANT ALL ON TABLE "public"."content_queue" TO "service_role";



GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."web_audits" TO "anon";
GRANT ALL ON TABLE "public"."web_audits" TO "authenticated";
GRANT ALL ON TABLE "public"."web_audits" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






\unrestrict YvFgoMILroBpTczgfgVixbGvDCxOe8JNOFNgM5VO3j28dqBrgJOHrmMD7z02dul

RESET ALL;
