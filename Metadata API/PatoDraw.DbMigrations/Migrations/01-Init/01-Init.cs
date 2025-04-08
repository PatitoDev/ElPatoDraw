using FluentMigrator;

namespace PatoDraw.DbMigrations.Migrations._01_Init
{
    [Migration(01)]
    public class _01_Init : Migration
    {
        public override void Down()
        {
            Execute.EmbeddedScript("PatoDraw.DbMigrations.Migrations._01_Init.01-Init-DOWN.sql");
        }

        public override void Up()
        {
            Execute.EmbeddedScript("PatoDraw.DbMigrations.Migrations._01_Init.01-Init-UP.sql");
        }
    }
}
