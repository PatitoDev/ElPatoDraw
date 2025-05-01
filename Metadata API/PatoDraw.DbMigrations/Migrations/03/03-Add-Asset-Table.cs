using FluentMigrator;

namespace PatoDraw.DbMigrations.Migrations._03;

[Migration(03)]
public class _03_Add_Asset_Table : Migration
{
    public override void Down()
    {
        Execute.EmbeddedScript("PatoDraw.DbMigrations.Migrations._03.03-Add-Asset-Table-DOWN.sql");
    }

    public override void Up()
    {
        Execute.EmbeddedScript("PatoDraw.DbMigrations.Migrations._03.03-Add-Asset-Table-UP.sql");
    }
}
