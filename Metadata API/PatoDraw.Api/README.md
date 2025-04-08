
# Metadata Api

This api is in charge of storing and handling file and folder structure metadata. The actual content of the file is stored in a Cloudflare R2 Storage behind a worker.

## Configuration

To run this api you will need to either enable the in memory db flag in the appsettings or add a connection string to the postgresql database and run the migration runner to create the tables.

Authentication is implemented by checking JWT tokens for the issuer and their encryption key. These values will need to the be added to the appsettings.

Bellow is an example format for the appsettings.json file.

```json
{
  "UseInMemoryDb":  false,
  "ConnectionStrings": {
    "PatoDrawDbConnection": "POSTGRESQL_CONNECTION_STRING"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "WorkerApiUrl": "FILE_WORKER_API",
  "Authorization": {
    "Secret": "JWT_SECRET",
    "Issuer": "JWT_ISSUER"
  }
}
```

> If you are using visual studio the `appsetting.json` will be hidden. You can change this by editing `PatoDraw.Api.csproj` or click `Show all files` on the solution explorer.