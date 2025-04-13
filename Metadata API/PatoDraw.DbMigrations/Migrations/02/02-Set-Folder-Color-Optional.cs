using FluentMigrator;

namespace PatoDraw.DbMigrations.Migrations._02_Set_Folder_Color_Optional;

[Migration(02)]
public class _02_Set_Folder_Color_Optional: Migration
{
    public override void Down()
    {
        Execute.EmbeddedScript("PatoDraw.DbMigrations.Migrations._02.02-Set-Folder-Color-Optional-DOWN.sql");
    }

    public override void Up()
    {
        Execute.EmbeddedScript("PatoDraw.DbMigrations.Migrations._02.02-Set-Folder-Color-Optional-UP.sql");
    }
}
