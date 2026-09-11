# Northstar Workspace

Northstar is a React and Express micro-SaaS operations dashboard for monitoring service health. Week 6 final integration includes JWT authentication, signup, role-gated admin actions, analytics, loading states, and dynamic alerts.

## Structure

- `frontend/`: Vite + React single-page dashboard
- `backend/`: Express API with JWT and bcrypt authentication

## Run locally

```powershell
cd backend
npm install
npm run dev
```

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@northstar.dev` | `admin123` |
| Member | `user@northstar.dev` | `user123` |

Admin users can view analytics and delete services. Member users can view service health but do not receive admin controls. The API also enforces the role check on the server.

## API testing evidence

The API listens on `http://localhost:4000`.

```powershell
# Health check
Invoke-RestMethod http://localhost:4000/api/health

# Admin login and token capture
$admin = Invoke-RestMethod http://localhost:4000/api/auth/login -Method Post -ContentType 'application/json' -Body '{"email":"admin@northstar.dev","password":"admin123"}'
$headers = @{ Authorization = "Bearer $($admin.token)" }

# Authenticated service list
Invoke-RestMethod http://localhost:4000/api/services -Headers $headers

# Admin-only analytics
Invoke-RestMethod http://localhost:4000/api/analytics -Headers $headers

# Admin-only mutation
Invoke-RestMethod http://localhost:4000/api/services/4 -Method Delete -Headers $headers
```

Expected outcomes: health returns `{ status: "ok" }`, authenticated services returns four seeded services, analytics returns active users/API calls/conversion/incident-free days, and delete returns the updated list. A member token receives HTTP `403` from `/api/analytics` and `DELETE /api/services/:id`.

## Validation

- Frontend production build: `npm run build` from `frontend/`
- Backend dependency audit: `npm install` completed with `0 vulnerabilities`
- API smoke script: `npm test` from `backend/`
