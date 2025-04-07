CREATE TABLE "Folder" (
	"Id" UUID PRIMARY KEY NOT NULL,
	"Name" VARCHAR(200) NOT NULL,
	"Color" VARCHAR(50) NOT NULL,
	"OwnerId" UUID NOT NULL,
	"CreatedAt" TIMESTAMP NOT NULL,
	"ModifiedAt" TIMESTAMP NOT NULL,
	"DeletedAt" TIMESTAMP,
	"Depth" INT NOT NULL,
	"ParentFolderId" UUID REFERENCES "Folder"("Id")
);

CREATE TABLE "File" (
	"Id" UUID PRIMARY KEY NOT NULL,
	"Name" VARCHAR(200) NOT NULL,
	"Type" INT NOT NULL,
	"OwnerId" UUID NOT NULL,
	"CreatedAt" TIMESTAMP NOT NULL,
	"ModifiedAt" TIMESTAMP NOT NULL,
	"DeletedAt" TIMESTAMP,
	"ParentFolderId" UUID REFERENCES "Folder"("Id")
);