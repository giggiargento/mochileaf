# Contenido vivo (búsqueda web con IA)

Mochileaf sigue siendo un sitio **estático** en Vercel (rápido y barato). La información “en tiempo real” se obtiene **antes del build** con la API de [Tavily](https://tavily.com) (búsqueda web pensada para agentes e IA).

## Configuración (una vez)

1. Crea cuenta en [tavily.com](https://tavily.com) y copia tu API key.
2. En la raíz del proyecto:
   ```bash
   cp .env.example .env
   ```
3. Pega la clave en `.env`:
   ```
   TAVILY_API_KEY=tvly-...
   ```

## Actualizar datos

```bash
npm run content:refresh
```

Eso escribe `src/data/live/cache.json`. Haz commit de ese archivo (o vuelve a desplegar) para que producción muestre la sección **Live intel** en los hubs de NTE y ACNH.

## Qué busca hoy

| Juego | Tema |
|--------|------|
| Neverness to Everness | Códigos redeem, meta / tier |
| Animal Crossing NH | Villagers populares / pulso comunidad |

Puedes editar las consultas en `scripts/refresh-live-content.mjs`.

## Automatizar (recomendado)

- **Local:** ejecuta `content:refresh` antes de `npm run build` cuando quieras datos frescos.
- **Vercel:** en el proyecto → Settings → Environment Variables → `TAVILY_API_KEY`. Luego un [Cron Job](https://vercel.com/docs/cron-jobs) que dispare un workflow de GitHub Actions, o un deploy programado que ejecute el script en CI y haga push del JSON (o un build con el script en `buildCommand`).

Ejemplo de `buildCommand` en Vercel (solo si la variable está en el entorno de build):

```json
"buildCommand": "npm run content:refresh && npm run build"
```

Si el refresh falla sin clave, el build fallará — mejor usar cron + commit del JSON.

## Fase 2: búsqueda al visitar la página

Para que cada visitante dispare una búsqueda nueva (más coste, clave solo en servidor):

1. Cambiar Astro a `output: 'hybrid'` + `@astrojs/vercel`.
2. Añadir `src/pages/api/live-search.ts` que llame a Tavily con la clave en `process.env`.
3. Un pequeño script en el cliente que llame a `/api/live-search?q=...`.

No está implementado aún para no romper el deploy estático actual.

## Otras APIs

| Servicio | Uso |
|----------|-----|
| **Tavily** | Búsqueda web + resumen (implementado) |
| **Perplexity / OpenAI + browsing** | Respuestas más largas; requiere endpoint y coste por request |
| **Notion** | Contenido editorial que tú apruebas (ya encaja con el flujo del sitio) |
