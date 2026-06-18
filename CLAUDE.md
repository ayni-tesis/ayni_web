# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es esto

Dashboard de operaciones del sistema **AYNI** (detección temprana de plagas en café). NO es la app del caficultor — es la herramienta interna para administradores de cooperativas, agrónomos, investigadores y técnicos SENASA: validar imágenes, consultar diagnósticos, generar reportes SENASA, monitorear el pipeline ML y auditar usuarios.

`PRODUCT.md` es la fuente de verdad de marca, personas y principios de diseño. **Léelo antes de cualquier trabajo de UI** — define decisiones no negociables (ver §Diseño abajo).

## Comandos

```bash
pnpm dev       # servidor de desarrollo (http://localhost:3000)
pnpm build     # build de producción (incluye type-check de Next)
pnpm start     # sirve el build de producción
pnpm lint      # biome check (lint)
pnpm format    # biome format --write
```

- **Gestor de paquetes: pnpm** (hay `pnpm-lock.yaml` y `pnpm-workspace.yaml`). El CI de Azure (`azure-pipelines.yml`) usa `npm install && npm run build` sobre Node 20.
- **No hay framework de tests** configurado. No inventes comandos `test`.
- **Lint/format: Biome** (no ESLint/Prettier), indentación de 2 espacios, organize-imports activado. Dominios `next` y `react` habilitados.
- Type-check aislado: `npx tsc --noEmit` (el tsconfig ya tiene `noEmit`).

## Stack

- **Next.js 16 App Router** + **React 19**, con **React Compiler activado** (`next.config.ts` → `reactCompiler: true`, `babel-plugin-react-compiler`). No agregues `useMemo`/`useCallback` por micro-optimización; el compiler los maneja (se usan en `use-hotkeys` solo por estabilidad de identidad de arrays).
- **Tailwind CSS v4** con configuración CSS-first: NO hay `tailwind.config.js`. Todos los tokens viven en `@theme {}` dentro de `app/globals.css`. PostCSS via `@tailwindcss/postcss`.
- **TanStack Query** para todo el data-fetching (provider en `lib/providers/query-provider.tsx`, montado en `app/layout.tsx`).
- **lucide-react** para iconos. Fuente: **Nunito** (`next/font`).
- Alias de imports: `@/*` → raíz del repo.

## Arquitectura

### Capa de API mock-first (patrón central)

Cada recurso en `lib/api/` define un **contrato de servicio** (`type XService`) con DOS implementaciones — `realXService` (llama al backend via `apiFetch`) y `mockXService` (sirve desde `lib/mock/` con latencia simulada) — y exporta la elegida según una env var:

```ts
const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";
export const usersService = useMock ? mockUsersService : realUsersService;
```

- **Por defecto corre en modo mock.** Para apuntar al backend real: `NEXT_PUBLIC_USE_MOCK_API=false`.
- `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8080/api`) apunta al API Gateway. El backend es microservicios (`user-service`, `diagnosis-service`).
- `apiFetch<T>` (`lib/api/client.ts`) centraliza fetch: inyecta `Authorization: Bearer` desde `localStorage["ayni.accessToken"]`, serializa body, construye query params, maneja 204 y lanza `ApiError`.
- Al implementar un recurso nuevo: replica este patrón (contrato + real + mock + selector) y mantén los tipos en `lib/api/types.ts` **alineados con los DTOs del backend**. La paginación sigue la forma de Spring (`PageResponse`: `content/page/size/totalElements/totalPages/last`).

### Hooks de datos

`lib/hooks/use-*.ts` envuelven los servicios con `useQuery`. Cada uno exporta una **query-key factory** (`usersKeys`, `plaguesKeys`) — usa esas factories para keys, nunca strings ad-hoc. Las listas usan `placeholderData: keepPreviousData` para evitar parpadeo al paginar/filtrar.

### Rutas

- `app/(admin)/` — route group del dashboard; comparte `layout.tsx` (Sidebar + Header). Páginas: `page.tsx` (inicio), `users`, `catalog`, `diagnoses`, `validation`, `pipeline`, `reports`, `alerts`, `monitoring`. La navegación se define en `components/admin/sidebar.tsx`.
- `app/brand/` — brand kit / deck de diseño (fuera del shell admin).

### i18n (regla de oro del producto)

Todos los strings de UI visibles viven en **`lib/i18n/es.ts`** (objeto `t`, español peruano es-PE). Los componentes NO llevan texto literal en español inline — se importa de `t`. En cambio, **las claves de enum del backend permanecen en inglés** en el código (`FARMER`/`AGRONOMIST`/`ADMIN`, `CRITICAL`/`HIGH_RISK`/...); solo se traducen al renderizar (mapas tipo `ROLE_LABELS`, `t.severity`, `t.roles`). Fechas relativas: `lib/format.ts` (`Intl.RelativeTimeFormat("es-PE")`).

## Diseño (no negociable — de PRODUCT.md)

- **Un solo verde.** `--color-primary` (#04A033) solo se usa cuando hay significado activo (estado positivo, CTA, item seleccionado). El resto vive en cream + forest + grises. Si todo es verde, nada es verde.
- **El dato manda.** Densidad con aire; jerarquía por peso tipográfico, no por color. Nada de "card-soup" ni grids genéricos icon-h3-párrafo (ver Anti-references en PRODUCT.md).
- **Desktop-first**, funcional en tablet ≥768px. NO mobile-first.
- **WCAG 2.1 AA**: contraste 4.5:1 body, targets ≥40×40px, `prefers-reduced-motion` respetado, y **el color nunca es el único canal** (estados siempre con ícono + etiqueta).
- **Atajos de teclado son contractuales** (sesiones de 30 min–2 h). Usa `lib/hooks/use-hotkeys.ts`; expón ayuda con `ShortcutsOverlay`. Ver `app/(admin)/users/page.tsx` como referencia completa del patrón (filtros + tabla + paginación + hotkeys + estados loading/error/empty).

### Tokens y utilidades de estilo

Definidos en `app/globals.css @theme`: escala de grises que **sobreescribe** la de Tailwind (`gray-1`..`gray-5`), escala tipográfica (`text-h1`..`text-h6`, `text-md`/`text-lg`), espaciado AYNI (`s1`..`s10`), y tokens de motion (`--ease-out`, `--duration-fast/base/slow`). Clases utilitarias propias: `.press` (feedback de :active scale), `.focus-ring` (ring verde de marca), `.nav-accent`, `.dot-pulse`, `.top-progress`. Helper de clases: `cn()` en `lib/utils.ts` (concat simple — NO es clsx/tailwind-merge).

## Crítica de diseño

`.impeccable/critique/` guarda revisiones de diseño con heurísticas de Nielsen y scores. Si trabajas en UI, revisa la crítica existente para no reintroducir issues ya señalados (feedback de press, estados de error en hooks, idioma, atajos, accent de nav que se desplaza, etc.).
