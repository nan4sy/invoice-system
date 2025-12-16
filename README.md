## Dev boot

### API
```bash
cd api
bin/rails s -p 3000
```

### WEB (Vite)
```bash
cd web
pnpm dev
```
UI: http://localhost:5173


### Health check
```bash
curl -i http://127.0.0.1:3000/health
```

### Smoke test (API)
```bash
curl -i http://127.0.0.1:3000/api/customers
```
Note: Vite proxies `/api/*` to Rails (see `web/vite.config.ts`).

