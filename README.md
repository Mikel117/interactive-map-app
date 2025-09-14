Para poder correr la aplicación necesitas la version de node v20.19.0 en adelante, de npm 10.8.2 en adelante, Angular CLI: 20.3.1.

## Configuración de Variables de Entorno

- Archivo local: copia `src/environments/environments.templ.ts` a `src/environments/environments.ts` y rellena tus valores.

```powershell
Copy-Item -Path src/environments/environments.templ.ts -Destination src/environments/environments.ts -Force
```

- En CI (GitHub Pages): el workflow genera `src/environments/environments.ts` con Secrets/Vars del repo.
  - Variables (Settings → Secrets and variables → Actions → Variables):
    - `VITE_COUNTRIES_API_URL`: URL base del API de países.
    - `VITE_GOOGLE_MAPS_ID`: Map ID opcional para estilos.
  - Secrets (Settings → Secrets and variables → Actions → Secrets):
    - `GOOGLE_MAPS_API_KEY`: API key de Google Maps.

## Despliegue a GitHub Pages

- El workflow `Deploy to GitHub Pages`:
  - Construye la app, verifica formato y tests.
  - Despliega solo en `main`.
  - En ramas `feat/**` solo construye y sube artifact.

### Lanzar deploy manual

1. Asegúrate de tener configurados los Secrets/Vars anteriores.
2. Ve a `Actions` → `Deploy to GitHub Pages` → `Run workflow` (workflow_dispatch).

## Scripts útiles

```powershell
npm ci
npm run format:check
npm run test:ci
npm run start
npm run build
```
