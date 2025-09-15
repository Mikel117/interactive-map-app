# Interactive Map App

Maqueta en Angular de un mapa interactivo con búsqueda por país, marcadores, y tabla vinculada a los resultados del dataset público de códigos postales.

## Requisitos

- Node.js 20.19.0 o superior
- npm 10.8.2 o superior
- Angular 20 (opcional, el proyecto ya trae CLI local)

## Instalar dependencias

```powershell
npm install
```

## Ejecutar en desarrollo

```powershell
npm start
```

Abrir http://localhost:4200

## Variables de entorno

Se dejaron las variables de entorno con fines de prueba. En un proyecto real no se deben exponer.
Las variables de Google solo funcionan en localhost:4200 y en la pagina desplegada con Github Pages.

## Pagina Demo con despliegue automatizado Actions

Puedes visualizar la app desplegada desde https://mikel117.github.io/interactive-map-app/

## Pruebas

Para ejecutar las pruebas usa el siguiente comando:

```powershell
npm run test:ci
```

## Build de producción

Si quieres hacer un build usa el siguiente comando:

```powershell
npm run build
```
