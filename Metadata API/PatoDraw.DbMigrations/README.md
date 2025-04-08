
# Database Migration Runner

This app handles database migrations and rollbacks.

## Commands

Running the application will execute all migrations found under the migrations folder.

You can pass the `-r` to rollback 1 change.

## Configuration

```json
{
  "ConnectionStrings": {
    "PatoDrawDbConnection": "POSTGRESQL_CONNECTION_STRING"
  }
}
```