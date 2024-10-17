CREATE TABLE IF NOT EXISTS "userTable" (
	"id" integer PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"hash_password" boolean NOT NULL,
	CONSTRAINT "userTable_email_unique" UNIQUE("email")
);
