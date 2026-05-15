# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Admin API Integration

- Admin route: `/admin` (legacy `/lol` now redirects to `/admin`)
- Auth flow: `/admin/login` is called from the admin login card and saves `accessToken` + `role` in `localStorage`.
- Bearer token: all admin requests use `Authorization: Bearer <token>` via `src/lib/adminApi.ts` (consumed by `src/services/admin/admin.service.ts`).
- Dev logging: request/response/error logs are enabled only in `import.meta.env.DEV`.

### Screen Filters and URL Params

- Users (`GET /admin/users`): `usersPage`, `usersLimit`, `usersCountry`, `usersState`, `usersApproxLocation`
- Advisors (`GET /admin/advisors`): `advisorsPage`, `advisorsLimit`, `advisorsUsername`, `advisorsEmail`, `advisorsCountry`, `advisorsState`, `advisorsVerificationStatus`, `advisorsIndustries`
- Advisor details (`GET /admin/advisors/:userId`): fetched on click only, not preloaded from list.
- Applications (`GET /admin/advisor-applications`): `applicationsPage`, `applicationsLimit`, `applicationsStatus`
- Enquiries (`GET /admin/advisors/:advisorId/enquiries`): `enquiryAdvisorId`, `enquiryPage`, `enquiryLimit`

### Notes

- Pagination is normalized to backend `pagination` and rendered via reusable `PaginationControls`.
- Text filters are debounced by ~300ms (`useDebouncedValue`).
- Stale requests are canceled with `AbortController` on filter/page changes.
- Reject application validates non-empty rejection reason before submit.

## Admin Advisor Application Review Flow

- List + filter + pagination:
  - `GET /admin/advisor-applications`
  - URL params: `applicationsPage`, `applicationsLimit`, `applicationsStatus`
  - Row action uses `applicationId` URL param to open review panel
- Edit pending application:
  - `PATCH /admin/advisor-applications/:id`
  - Editable fields: username, industries, country/state, socialLinks, about, marketFocus, expertiseIndeces, emailForContact, personalWebsite, follower/subscriber metrics
- Approve after review:
  - `PATCH /admin/advisor-applications/:id/approve`
- Reject with reason:
  - `PATCH /admin/advisor-applications/:id/reject`
  - Rejection reason required in UI
- Behavior:
  - Non-pending applications are read-only in review panel
  - Save blocked when no fields changed
  - Numeric metrics validated as non-negative
  - List refreshes after save/approve/reject and keeps current page/filter
