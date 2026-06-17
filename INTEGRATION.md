# Guía de Integración con el Backend — AYNI Web Dashboard

> Mapeo del flujo de datos, endpoints consumidos/necesarios y variables de entorno para conectar este dashboard con el backend.

---

## 1. Resumen del Proyecto

**Arquitectura de peticiones:** `Fetch` nativo + **TanStack Query (React Query) v5**. **No usa Axios.**

El flujo de datos sigue una cadena consistente en 4 capas:

```
Componente/Página  →  Hook (useQuery)  →  Service (real | mock)  →  apiFetch()  →  Backend
 (app/(admin)/*)       (lib/hooks/*)       (lib/api/*)              (lib/api/client.ts)
```

**Puntos clave de la arquitectura:**

- **Cliente central:** `lib/api/client.ts` → función `apiFetch<T>()`. Inyecta `Content-Type: application/json`, serializa el body a JSON, construye query params y maneja respuestas `204` y errores (`ApiError`).
- **Autenticación:** Bearer token leído desde `localStorage["ayni.accessToken"]`. Se adjunta automáticamente como header `Authorization: Bearer <token>` si existe. ⚠️ **No hay pantalla de login en el proyecto** — el backend deberá proveer un endpoint de auth que genere ese token, y alguien debe guardarlo en `localStorage`.
- **Patrón mock-first (¡importante!):** Cada recurso define un contrato (`type XService`) con **dos implementaciones** — `realXService` (llama al backend) y `mockXService` (datos locales con latencia simulada). Un selector elige según la variable de entorno:
  ```ts
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";
  ```
  → **Para conectar tu backend real debes poner `NEXT_PUBLIC_USE_MOCK_API=false`.**
- **Paginación estándar (estilo Spring `Page`):** las listas esperan esta forma de respuesta:
  ```json
  { "content": [], "page": 0, "size": 9, "totalElements": 48, "totalPages": 6, "last": false }
  ```
- **Query keys:** factories en cada hook (`usersKeys`, `plaguesKeys`) para invalidación de caché.

### ✅ Estado real de la integración (actualizado 2026-06-16)

**Integración COMPLETA.** Las 10 vistas del dashboard + la búsqueda global del header consumen
endpoints reales del backend vía Gateway. Ya **no queda mock de datos** (`NEXT_PUBLIC_USE_MOCK_API=false`,
arrays `MOCK_*` y `lib/mock/` eliminados). Única salvedad por diseño: en Pipeline ML las tarjetas de
modelo son reales (`GET /api/pipeline/models`), pero el **historial de versiones y el rollback** quedan
como referencia ilustrativa/deshabilitado porque no existe un model registry. La tabla 2.A lista lo
implementado; la 2.B se conserva como histórico de lo que originalmente faltaba.

---

## 2. Tabla de Endpoints

### 2.A — Endpoints YA implementados en código (vía `apiFetch`)

Estos se conectan de inmediato cambiando la env var. Las rutas son relativas al `API_BASE_URL`.

| Componente/Vista | Método | Ruta del Endpoint | Descripción/Propósito |
|---|---|---|---|
| Usuarios (`/users`) | `GET` | `/users?page&size&search&role` | Lista paginada de usuarios. `role` ∈ `FARMER\|AGRONOMIST\|ADMIN` (omite si es `ALL`). |
| Usuarios (detalle) | `GET` | `/users/{id}` | Obtener un usuario por ID (`getById` definido, aún sin UI). |
| Catálogo (`/catalog`) | `GET` | `/diagnoses/plagues?page&size&search&severities` | Catálogo paginado de plagas. `severities` = lista separada por comas (`CRITICAL,HIGH_RISK,MODERATE,LOW`). |
| Catálogo (detalle) | `GET` | `/diagnoses/plagues/{id}` | Obtener una plaga por ID (`getById` definido). |

### 2.B — Endpoints REQUERIDOS por la UI (aún con mock inline / TODOs)

Inferidos del comportamiento de cada vista, los `TODO` en el código, y los prefijos por microservicio. **Las rutas marcadas son sugerencias** basadas en la convención existente (`/users` → user-service, `/diagnoses` → diagnosis-service); ajústalas a tu backend.

| Componente/Vista | Método | Ruta del Endpoint (sugerida) | Descripción/Propósito |
|---|---|---|---|
| **Auth** (implícito) | `POST` | `/auth/login` | Login que devuelve `accessToken` para guardar en `localStorage["ayni.accessToken"]`. |
| Usuarios | `POST` | `/users` | Crear usuario (botón "Crear usuario"). |
| Usuarios | `PATCH` | `/users/{id}` | Editar / activar / desactivar (cambio de `status`). *TODO explícito en `users/page.tsx`.* |
| Usuarios | `POST` | `/users/{id}/reset-password` | Restablecer contraseña (acción de fila). |
| Usuarios | `DELETE` | `/users/{id}` | Eliminar cuenta (acción de fila). |
| Catálogo | `POST` | `/diagnoses/plagues` | Agregar plaga al catálogo. |
| Catálogo | `PATCH` | `/diagnoses/plagues/{id}` | Editar plaga. *TODO explícito en `catalog/page.tsx`.* |
| Catálogo | `DELETE` | `/diagnoses/plagues/{id}` | Eliminar plaga. |
| Inicio (`/`) | `GET` | `/dashboard/stats` | KPIs: caficultores activos, pendientes de validar, alertas activas, precisión del modelo. |
| Inicio | `GET` | `/diagnoses?recent=true` | Diagnósticos recientes sincronizados. |
| Inicio / Monitoreo | `GET` | `/monitoring/services` | Estado de salud de microservicios. |
| Diagnósticos (`/diagnoses`) | `GET` | `/diagnoses?search&pest&sector&dateFrom&dateTo&page&size` | Historial filtrable (caficultor, finca, plaga, sector, fecha, estado `PENDING\|CONFIRMED\|REJECTED`). |
| Diagnósticos | `GET` | `/diagnoses/heatmap?sector` | Datos geográficos para el mapa de calor fitosanitario. |
| Diagnósticos | `GET` | `/diagnoses/export?format=csv` | Exportar historial. |
| Validación (`/validation`) | `GET` | `/diagnoses/validation-queue` | Cola de imágenes de baja confianza (<60%) pendientes de etiquetado. |
| Validación | `POST` | `/diagnoses/{id}/validate` | Confirmar/corregir etiqueta → retroalimenta el dataset (body: `{ label, confirmed }`). |
| Validación | `POST` | `/diagnoses/{id}/reject` | Rechazar imagen (descartar del dataset). |
| Pipeline ML (`/pipeline`) | `GET` | `/pipeline/models` | Historial de versiones de modelos (YOLOv8, SmallPavicNet) + métricas (mAP, F1, latencia). |
| Pipeline ML | `POST` | `/pipeline/models/{version}/rollback` | Revertir a una versión anterior del modelo. |
| Reportes (`/reports`) | `GET` | `/reports` | Lista de reportes generados. |
| Reportes | `POST` | `/reports` | Generar reporte (body: `type`, `dateFrom`, `dateTo`, `sector`, `anonymize`). Tipos: SENASA, actividad, plagas, dataset. |
| Reportes | `GET` | `/reports/{id}/download?format=pdf\|csv` | Descargar reporte generado. |
| Monitoreo (`/monitoring`) | `GET` | `/monitoring/services` | Microservicios: CPU, RAM, réplicas, latencia, estado. |
| Monitoreo | `GET` | `/monitoring/infrastructure` | Estado de PostgreSQL, Kafka, Blob Storage, FCM. |
| Monitoreo | `POST` | `/monitoring/services/{name}/restart` | Reiniciar un microservicio. |
| Monitoreo | `POST` | `/monitoring/actions/{action}` | Acciones rápidas: `purge-queues`, `restart-kafka`, `download-logs`. |
| Alertas (`/alerts`) | `GET` | `/alerts/rules` | Lista de reglas de alerta fitosanitaria. |
| Alertas | `POST` | `/alerts/rules` | Crear regla (umbral, sector, canales, destinatarios). |
| Alertas | `PATCH` | `/alerts/rules/{id}` | Activar/Pausar regla (cambio de `status`). |
| Alertas | `DELETE` | `/alerts/rules/{id}` | Eliminar regla. |
| Header (global) | `GET` | `/search?q=` | Búsqueda global (plagas, caficultores, alertas) — UI presente, sin conectar. |

---

## 3. Variables de Entorno

El proyecto **no incluye un `.env`** (no existe `.env`, `.env.local` ni `.env.example`). Las variables se leen directamente con `process.env`. Crea un **`.env.local`** en la raíz con:

```bash
# Base URL global de tu backend / API Gateway.
# Se antepone a TODAS las rutas (ej. /users → http://.../api/users).
# Default si se omite: http://localhost:8080/api
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# Interruptor mock vs. real. DEBE ser exactamente "false" para usar tu backend.
# Cualquier otro valor (o ausencia) mantiene los datos mock.
NEXT_PUBLIC_USE_MOCK_API=false
```

**Detalles importantes:**

- El prefijo `NEXT_PUBLIC_` es obligatorio en Next.js para exponer la variable al navegador (estas peticiones corren client-side: todas las páginas son `"use client"`).
- `API_BASE_URL` ya incluye `/api` en el default → las rutas de la tabla **no** repiten ese prefijo.
- La lógica del interruptor es `!== "false"`, así que **debe escribirse literalmente `false`** para activar el backend real.
- Tras crear/editar `.env.local`, **reinicia el servidor** (`npm run dev`).

---

## 4. Recomendación para la integración

El camino de menor fricción es empezar por **Usuarios** y **Catálogo** (sección 2.A): ya tienen la capa de servicios completa; solo necesitas levantar `GET /users` y `GET /diagnoses/plagues` con la forma `PageResponse`, poner `NEXT_PUBLIC_USE_MOCK_API=false` y funcionarán sin tocar el front.

Para las otras 7 vistas habrá que crear su `service` + `hook` siguiendo el patrón de `lib/api/users.ts` (los arrays `MOCK_*` inline en cada página son la referencia exacta de la forma de datos que espera cada componente).

### Tipos de datos de referencia

Los contratos TypeScript ya definidos viven en `lib/api/types.ts`:

- `User` / `UserRole` / `UserStatus` / `ListUsersParams`
- `Plague` / `Severity` / `PlagueTagKind` / `ListPlaguesParams`
- `PageResponse<T>` (envoltura de paginación)
- `ApiError` (`{ status, message, path? }`)
