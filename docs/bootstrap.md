## Dev boot

### API
cd api
bin/rails s -p 3000

### WEB (Vite)
cd web
pnpm dev

### Health check
curl -i http://127.0.0.1:3000/health
