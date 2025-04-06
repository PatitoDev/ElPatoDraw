using Microsoft.EntityFrameworkCore;
using PatoDraw.Api.Authorization;
using PatoDraw.Api.Features.Folders;
using PatoDraw.Infrastructure;
using PatoDraw.Worker;
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


builder.Services.AddMediatR(c => c.RegisterServicesFromAssemblyContaining<FolderController>());

var workerBaseUrl = builder.Configuration.GetValue<string>("WorkerApiUrl");
if (workerBaseUrl == null)
    throw new Exception("Missing worker api url in appsettings");

var workerHttpClient = new HttpClient();
builder.Services.AddScoped<IWorkerClient, WorkerClient>(c => 
    new WorkerClient(workerHttpClient, workerBaseUrl)
);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(b => 
    b
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod()
);

app.UseMiddleware<AuthorizationMiddleware>();

app.MapControllers();


app.Run();
