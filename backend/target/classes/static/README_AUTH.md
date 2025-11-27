Frontend auth integration

Files:
- `static/auth/login.html`
- `static/auth/register.html`
- `static/dashboard.html`
- `static/js/auth.js`

How it works:
- `auth.js` exposes `Auth.login`, `Auth.register`, and `Auth.authFetch`.
- Login stores JWT in `localStorage` key `vg_token`.
- `authFetch` attaches `Authorization: Bearer <token>` to requests.

API endpoints expected (backend):
- POST `/api/auth/register` — { name, username, email, password }
- POST `/api/auth/login` — { username|email, password } -> returns { token, role, username }

Notes:
- Dashboard demo reads `/api/members` and shows the first member as profile (demo only).
- Protect endpoints server-side — ensure JWT middleware is configured (done in backend).

