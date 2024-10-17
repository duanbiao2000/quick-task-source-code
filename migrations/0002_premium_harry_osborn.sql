CREATE TABLE IF NOT EXISTS "userTable" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"hash_password" text NOT NULL,
	CONSTRAINT "userTable_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "user";--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_userTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."userTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
