# Interactive Map App

Maqueta en Angular de un mapa interactivo con búsqueda por país, marcadores, y tabla vinculada a los resultados del dataset público de códigos postales.

## Requisitos

- Node.js 20.19.0
- npm 10.8.2
- Angular 20

### Si no tienes estas versiones (Windows)

Opción A (recomendada) con nvm-windows:

```powershell
nvm install 20.19.0
nvm use 20.19.0
npm i -g npm@10.8.2
node -v
npm -v
```

Opción B (sin nvm):

- Descarga Node 20.19.0 desde https://nodejs.org y reinstala. Luego, si hace falta:

```powershell
npm i -g npm@10.8.2
```

Angular CLI global (opcional, el proyecto ya trae CLI local):

```powershell
npm i -g @angular/cli@20
ng version
```

## Instalación

```powershell
# Instalar dependencias
npm ci
```

## Ejecutar en desarrollo

```powershell
npm start
# Abrir http://localhost:4200
```

## Variables de entorno

Se dejaron las variables de entorno con fines de prueba. En un proyecto real no se deben exponer.

## Pruebas

```powershell
npm run test:ci
```

## Build de producción

```powershell
npm run build
```
