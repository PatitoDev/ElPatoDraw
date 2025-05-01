CREATE TABLE "Asset" (
	"Id" UUID PRIMARY KEY NOT NULL,
	"Name" VARCHAR(200) NOT NULL,
	"ContentType" VARCHAR(200) NOT NULL,
	"SizeInBytes" bigint NOT NULL,
	"CreatedAt" TIMESTAMP NOT NULL,
	"ParentFileId" UUID REFERENCES "File"("Id")
);
