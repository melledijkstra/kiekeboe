# n8n Automation Workspace

This package manages a local n8n instance running inside Docker (via Colima) and provides utility scripts to version control workflows in Git.

## Setup Instructions

### 1. Prerequisite: Start Colima
Ensure your Colima container runtime is running:
```bash
colima start
```

### 2. Environment Variables
Copy the template `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure you generate a secure random string for `N8N_ENCRYPTION_KEY` in `.env` to encrypt credentials inside the local database.

### 3. Spin up n8n
From the workspace root, run:
```bash
pnpm --filter=@odysea/n8n up
```
This spins up n8n in detached mode. n8n will be accessible at:
👉 **[http://localhost:8080](http://localhost:8080)**

Create your initial owner account on first load.

---

## Workspace Scripts

Run these scripts from the repository root to manage the container and version control workflows.

| Command | Action | Description |
| :--- | :--- | :--- |
| `pnpm --filter=@odysea/n8n up` | Start | Starts n8n in the background. |
| `pnpm --filter=@odysea/n8n down` | Stop | Stops and removes the n8n container. Data is persisted. |
| `pnpm --filter=@odysea/n8n logs` | Logs | Stream container logs. |
| `pnpm --filter=@odysea/n8n backup` | Backup | Exports all workflows from n8n database to `/workflows` as JSON files. |
| `pnpm --filter=@odysea/n8n restore` | Restore | Imports all JSON files in `/workflows` back into n8n. |

### How to Version Control Workflows
1. Build/edit your workflows in the n8n UI at `http://localhost:8080`.
2. Run the backup command:
   ```bash
   pnpm --filter=@odysea/n8n backup
   ```
3. Commit the newly updated/created JSON files in the `workflows/` directory to Git:
   ```bash
   git add apps/n8n/workflows/
   git commit -m "feat(n8n): add new aggregator workflow"
   ```

---

## Connecting to Supabase

To build a database aggregator for time-based data, follow these steps:

### 1. Create a Supabase Project
1. Log in to [Supabase](https://supabase.com/).
2. Create a new project.
3. Once the database is ready, go to **Settings > Database** to retrieve the Connection string parameters:
   - **Host**
   - **Port** (usually `5432` or `6543` for connection pooling)
   - **Database Name** (typically `postgres`)
   - **User** (typically `postgres`)
   - **Password** (the one you set during setup)

### 2. Configure Credentials in n8n
1. In your local n8n dashboard, go to **Credentials > Add Credential**.
2. Search for **Postgres**.
3. Fill in the connection settings retrieved from Supabase.
4. Test and save the credentials.

### 3. Design the Database Table
For aggregating time-based data from APIs, we recommend creating a table designed to handle raw event streams or time-series data. Execute the following SQL in Supabase's **SQL Editor**:

```sql
create table aggregator_events (
  id uuid default gen_random_uuid() primary key,
  source text not null,               -- e.g., 'github_api', 'strava', 'fitbit'
  event_type text not null,           -- e.g., 'commit', 'activity', 'sleep_log'
  event_time timestamptz not null,    -- The timestamp when the event occurred
  payload jsonb not null default '{}', -- The raw JSON payload from the API
  created_at timestamptz default now() not null
);

-- Index for fast time-series querying
create index idx_aggregator_events_time on aggregator_events (event_time desc);
-- Index for query by source
create index idx_aggregator_events_source on aggregator_events (source);
```

### 4. Create your first Workflow in n8n
1. Add a **Schedule Trigger** node set to run daily/hourly.
2. Add an **HTTP Request** node to fetch data from your API of choice.
3. Add a **Postgres** node configured with your Supabase credentials:
   - Set the action to **Insert**.
   - Select the `aggregator_events` table.
   - Map the data: set `source` to the API name, `event_time` to the API timestamp, and `payload` to the full JSON response.
