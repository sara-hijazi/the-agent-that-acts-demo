# The Agent That Acts

Arabic-first, bilingual interactive portfolio demo for a marketing consultation agent. React, Vite, strict TypeScript. Runs entirely in the browser; no login or APIs.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173. Run `npm run check`, `npm run build`, and `npm run validate` for lightweight verification. Production files are in `dist/`, with relative asset paths for static hosting.

See PRODUCT_SPEC.md and DESIGN.md for the source of truth. The parser is deterministic, not an LLM. Appointments and confirmation are local browser-session state; language and theme persist in local storage. Home preserves completed company records while clearing the active journey. Refresh clears appointments.
