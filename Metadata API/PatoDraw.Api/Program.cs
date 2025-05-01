using Microsoft.EntityFrameworkCore;
using PatoDraw.Api.Authorization;
using PatoDraw.Api.Features.Folders;
using PatoDraw.Infrastructure;
using PatoDraw.Worker.V1;
using PatoDraw.Worker.V2;
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
    {
        if (builder.Configuration.GetValue<bool>("UseInMemoryDb"))
        {
            c.UseInMemoryDatabase("ElPatoDraw.Table");
        }
        else
        {
            c.UseNpgsql(builder.Configuration.GetConnectionString("PatoDrawDbConnection"));
        }
    } 
    );


builder.Services.AddMediatR(c => c.RegisterServicesFromAssemblyContaining<FolderController>());

var workerBaseUrl = builder.Configuration.GetValue<string>("WorkerApiUrl");
if (workerBaseUrl == null)
    throw new Exception("Missing worker api url in appsettings");

// v1
var workerHttpClient = new HttpClient();
builder.Services.AddScoped<IWorkerClient, WorkerClient>(c => 
    new WorkerClient(workerHttpClient, workerBaseUrl)
);

// v2
var fileContentApiHttpClientV2 = new HttpClient();
var fileContentApiSecret = builder.Configuration.GetValue<string>("WorkerApiSecret");
if (fileContentApiSecret == null)
    throw new Exception("Missing file content api secret in appsettings");

builder.Services.AddScoped<IFileContentApiClient, FileContentApiClient>(c => 
    new FileContentApiClient(workerHttpClient, workerBaseUrl, fileContentApiSecret)
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
