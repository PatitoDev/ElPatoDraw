using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PatoDraw.Api.Features.Directories;
using PatoDraw.Infrastructure;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services
    .AddControllers()
    .AddJsonOptions(o => {
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services
    .AddDbContext<PatoDrawDbContext>(c => 
        c.UseInMemoryDatabase("ElPatoDraw.Table")
    );


// TODO - find a better file type for this
builder.Services.AddMediatR(c => c.RegisterServicesFromAssemblyContaining<FolderController>());

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
