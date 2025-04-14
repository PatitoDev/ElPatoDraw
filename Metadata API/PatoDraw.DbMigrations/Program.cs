using FluentMigrator.Runner;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PatoDraw.DbMigrations.Migrations._01_Init;

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .Build();

var services = new ServiceCollection()
    .AddFluentMigratorCore()
    .ConfigureRunner(rb =>
        rb
        .AddPostgres()
        .WithGlobalConnectionString(configuration.GetConnectionString("PatoDrawDbConnection"))
        .ScanIn(typeof(_01_Init).Assembly)
        .For
        .Migrations()
        .For
        .EmbeddedResources()
    )
    .AddLogging(lb => lb.AddFluentMigratorConsole())
    .BuildServiceProvider(false);

var runner = services.GetRequiredService<IMigrationRunner>();

if (args.FirstOrDefault() == "-r")
{
    runner.Rollback(1);
} else
{
    runner.ListMigrations();
    runner.MigrateUp();
}
