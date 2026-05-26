Offline run instructions

Prerequisites (one-time, requires network):
- Node.js (v16+ recommended) installed on the machine where you'll run offline.

Steps to prepare (on a machine with internet):
1. From repo root run:

   cd backend
   npm install --no-audit --no-fund

2. From repo root run (build frontend):

   cd frontend
   npm install --no-audit --no-fund
   npm run build

3. Optionally create an archive of the repository folder (include `node_modules`, `backend`, `frontend/dist`, and these scripts) and transfer it to the offline machine.

Running offline (no network required):
- On the offline machine, unpack the archive and run one of:

  PowerShell:
    ./run-offline.ps1

  CMD:
    run-offline.bat

This launches the backend (`backend/server.js`) and a tiny static server (`static-server.js`) serving `frontend/dist` on http://localhost:3000.

If you prefer a single process (development only), you can also run the backend and preview the frontend with:

  node backend/server.js
  node static-server.js
