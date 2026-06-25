# FreelanceFlow Frontend

React dashboard shell built with Vite.

## Project Structure

```
frontend/
├── index.html
├── vite.config.js
└── src/
    ├── main.jsx                  # Entry point: router + theme provider
    ├── App.jsx                    # Layout: navbar, sidebar, routes
    ├── index.css                  # Global styles + theme CSS variables
    ├── context/
    │   └── ThemeContext.jsx       # Light/dark theme state + persistence
    ├── components/
    │   ├── Navbar/                # Top bar with hamburger + theme toggle
    │   ├── Sidebar/                # Slide-out navigation drawer
    │   ├── ThemeToggle/            # Light/dark toggle button
    │   └── PlaceholderPage/        # Shared placeholder layout for nav pages
    └── pages/
        ├── CurrentProjects.jsx
        ├── ClosedProjects.jsx
        ├── Payments.jsx
        └── Invoices.jsx
```

## Running

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## Notes

- Theming is implemented with CSS variables scoped under
  `:root[data-theme="light"]` and `:root[data-theme="dark"]`, toggled via a
  `data-theme` attribute on `<html>`. The chosen theme persists in
  `localStorage` under the `freelanceflow-theme` key.
- Routing uses `react-router-dom`. The sidebar's four links are the only
  routes defined; visiting `/` redirects to `/current-projects`.
- Pages currently render a shared `PlaceholderPage` component with no
  business logic, per this stage's scope.
