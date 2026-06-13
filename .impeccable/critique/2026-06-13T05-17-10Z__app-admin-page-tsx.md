---
target: Users + Admin Shell
total_score: 20
p0_count: 2
p1_count: 3
timestamp: 2026-06-13T05-17-10Z
slug: app-admin-page-tsx
---
# Critique · Users + Admin Shell

## Design Health Score

| # | Heurística | Score | Issue clave |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | `keepPreviousData` + skeleton; faltan tail indicator y feedback de press. |
| 2 | Match System / Real World | 2 | UI en inglés contradice principio #5 de PRODUCT.md. |
| 3 | User Control and Freedom | 1 | Sin "limpiar filtros", sin Esc, sin shortcuts. |
| 4 | Consistency and Standards | 3 | Tres alturas de pill (48/44/36) coexisten. |
| 5 | Error Prevention | 2 | Search sin debounce; pagination bien bordeada. |
| 6 | Recognition Rather Than Recall | 3 | `MoreVertical` sin tooltip. |
| 7 | Flexibility and Efficiency | 1 | Cero atajos de teclado para sesiones 30 min-2 h. |
| 8 | Aesthetic and Minimalist Design | 3 | Filter bar + table en cards apilados. |
| 9 | Error Recovery | 1 | `useUsers` no maneja error; 500 colapsa a "sin resultados". |
| 10 | Help and Documentation | 1 | Sin tooltips ni hints de atajos. |
| Total | | 20/40 | Acceptable |

## Anti-Patterns Verdict

LLM: no slop. Detector: `[]` limpio. Brand kit `/brand` usa numeración `01..09` aceptable por contexto de deck deliberado, pero podría omitirse.

## Priority Issues

### [P0] Botones sin feedback de press
Cero `:active` con `scale(0.97)`. La única señal háptica disponible está ausente. Variable `--ease-out`, `transition: transform 160ms`, `:active { transform: scale(0.97) }` en NavItem, Header CTA, Create User, Filters, role tabs, pagination, MoreVertical.

### [P0] Sin error state en `useUsers`
`data?.content ?? []` traga 500s. Estado de error con copy honesto y `refetch()`, reutilizable porque aparecerá en cada página.

### [P1] UI en inglés contradice principio #5 de PRODUCT.md
"Search by name or email", "All Users", "Farmers", "Just now"... debe ser español. `Intl.RelativeTimeFormat("es-PE")`. Tabla de strings en `lib/i18n/es.ts`. `ROLE_LABELS` → Caficultor/Agrónomo/Admin.

### [P1] Cero atajos de teclado
`/` focus search, Esc clear, ←/→ pagination, 1/2/3 role tabs, `?` help overlay. PRODUCT.md describe sesiones 30 min-2 h: contractual.

### [P1] Nav active accent no se mueve entre items
Spatially desconectado. Shared-layout (`motion.span layoutId`) o un único `position: absolute` que traslada a `top: ${activeIndex * 56}px` con `transition: top 200ms var(--ease-out)`.

### [P2] Filter bar y table en dos cards apilados
Un solo card con `border-bottom` interno. Pagination dentro del mismo bloque. Eliminar `gap-4`.

### [P2] MoreVertical placeholder sin destino
Implementar menú real (Edit/Reset password/Deactivate/Delete) o esconder hasta que exista.

### [P3] Sin transición al paginar/filtrar
Top progress bar 2px primary durante `isFetching && !isLoading`. Sin shimmer, sin gradiente.

## Persona Red Flags

**Alex**: sin `/`, sin bulk-select, MoreVertical placeholder.
**Sam**: focus indicators heredados (azul default vs primary verde); bell dot sin aria-live; skeleton sin `prefers-reduced-motion`.
**Mariana (SENASA)**: el idioma. Cada string.

## Minor Observations

- `Showing 1 to 4 of 48 results` sin `tabular-nums`.
- Notification dot estático; subtle fade-pulse 1.5s mejoraría.
- Header search promete búsqueda global no conectada.
- Brand kit numeración `01..09` podría omitirse.

## Questions

- "New Report" global → contextual por página?
- Tabla → lista en tablet 768px?
- Sidebar siempre visible → command palette estilo Linear?
