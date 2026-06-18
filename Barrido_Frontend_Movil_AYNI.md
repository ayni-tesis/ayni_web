# Barrido Frontend & App Móvil — Proyecto AYNI

> **Propósito:** mapa de historias de usuario (HU) centradas en **front web** y **app móvil**, organizado como checklist para cotejar contra tu aplicación ya desarrollada y marcar qué **se cumple**, qué **falta**, qué está **parcial** y qué está **de más**.
>
> **Fuente:** `Historias_de_Usuario_AYNI.xlsx` (75 HU totales, 9 épicas).

---

## 1. Cómo usar este documento

1. Recorre cada bloque en orden (Móvil → Móvil+Web → Web).
2. En cada HU, anota la **pantalla/componente** real donde la encontraste en tu app.
3. Marca el **estado global** y luego verifica los **criterios de aceptación** uno por uno (cada criterio es un escenario del Excel).
4. Lo que encuentres en tu app y **no** corresponda a ninguna HU, regístralo en la sección **§6 Funcionalidades "de más"**.
5. Al final, llena el **§7 Resumen de cobertura**.

### Leyenda de estados

| Símbolo | Significado |
|---|---|
| ✅ Cumple | Implementado y los 3 criterios pasan |
| 🟡 Parcial | Existe pero faltan criterios o tiene defectos |
| ❌ Falta | No existe en la app |
| ➕ De más | Está en la app pero no figura en ninguna HU |
| 🚫 N/A | No aplica a esta plataforma |

### Leyenda de plataforma

📱 Móvil exclusivo · 🌐 Web exclusivo · 🔁 Móvil + Web (front compartido)

---

## 2. Resumen del mapeo

| Categoría | # HU | Historias |
|---|---|---|
| 📱 **Móvil (exclusivo/principal)** | 15 | HU0005, 07, 10, 11, 12, 25, 26, 28, 31, 34, 35, 36, 45, 46, 47 |
| 🔁 **Móvil + Web (front compartido)** | 17 | HU0001, 02, 06, 08, 09, 20, 21, 22, 29, 30, 38, 39, 40, 41, 42, 43, 44 |
| 🌐 **Web (exclusivo)** | 21 | HU0003, 14, 15, 16, 17, 19, 23, 24, 32, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 64, 70 |
| ⚙️ **Backend / Infra / ML (fuera del front)** | 22 | HU0004, 13, 18, 27, 33, 37, 58–63, 65–69, 71–75 |
| | **75** | |

> **Total con interfaz que debes barrer: 53 HU** (15 móvil + 17 compartidas + 21 web).
> El bloque backend se incluye como **Anexo §5** solo de referencia — **no** lo busques como pantalla.

### Notas de criterio (casos límite que decidí)

- **HU0026** (versiones de la app): la *configuración* es de admin (web/backend), pero la **pantalla bloqueante "Actualizar ahora"** vive en el móvil → la cuento como móvil.
- **HU0035** (modo oscuro): el Excel la agrupa en la épica web (E08), pero el enunciado habla de "teléfono/batería en el campo" → la trato como **móvil**. Revísala también en web si tu web tiene dark mode.
- **HU0036** (compresión de imágenes): la compresión ocurre en el **cliente móvil** antes de subir → móvil.
- **HU0064** (reglas de alerta): el *motor de reglas* es backend, pero hay un **formulario de admin** para crear la regla → la dejo en web por ese formulario.
- **HU0070** (panel de monitoreo): es observabilidad, pero se materializa como un **dashboard web de admin** → web.
- **HU0027** (logs de crashes), **HU0062** (circuit breaker / fallback), **HU0068** (reporte por correo): viven en backend, pero **tocan el móvil** (SDK de crashes, fallback offline, toggle de preferencia). Anotadas en el Anexo con su "gancho" móvil.

---

## 3. 📱 BLOQUE MÓVIL (15 HU)

### HU0005 — Capturar foto de hoja de café desde la app  ·  E02
- **Rol:** Agricultor · **Plataforma:** 📱 Móvil
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Captura exitosa: con permiso de cámara y al presionar capturar → toma foto, muestra vista previa, permite confirmar/repetir.
  - [ ] Permisos denegados → mensaje explicativo + botón que abre la configuración del dispositivo.
  - [ ] Calidad insuficiente (borrosa/oscura) → advierte y sugiere repetir con mejor iluminación.
- **Notas:** ________________________

### HU0007 — Ver el diagnóstico de la plaga en pantalla del móvil  ·  E02
- **Rol:** Agricultor · **Plataforma:** 📱 Móvil
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Diagnóstico exitoso → muestra nombre de plaga + descripción breve en < 5 s.
  - [ ] Hoja sana → "No se detectaron plagas" con indicador verde.
  - [ ] Error de inferencia → activa modo offline (si hay) o muestra mensaje de reintento.
- **Notas:** ________________________

### HU0010 — Detección automática del estado de conectividad  ·  E03
- **Rol:** Agricultor · **Plataforma:** 📱 Móvil
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Con conexión → envía la imagen al Detection Service en la nube.
  - [ ] Sin conexión → modo offline, guarda en SQLite, ícono de "pendiente de sincronización".
  - [ ] Cambio de estado en pleno uso → toast no intrusivo + ajuste automático del modo.
- **Notas:** ________________________

### HU0011 — Guardar fotos localmente sin señal  ·  E03
- **Rol:** Agricultor · **Plataforma:** 📱 Móvil
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Sin conexión → guarda imagen + metadatos (fecha, GPS, cultivo) en SQLite.
  - [ ] Almacenamiento lleno → notifica y sugiere liberar espacio o sincronizar.
  - [ ] Historial muestra las fotos con ícono "pendiente de sincronizar".
- **Notas:** ________________________

### HU0012 — Sincronización automática al recuperar conexión  ·  E03
- **Rol:** Administrador (comportamiento del cliente móvil) · **Plataforma:** 📱 Móvil
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Al restaurar internet → sube pendientes en background, cola FIFO.
  - [ ] Fallo de subida → reintenta con backoff exponencial hasta 5 veces antes de marcar "error".
  - [ ] Al terminar → notificación local con conteo de imágenes sincronizadas.
- **Notas:** ________________________

### HU0025 — Guía / tutorial dentro de la app  ·  E02
- **Rol:** Agricultor · **Plataforma:** 📱 Móvil
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Acceso desde menú "Guía / tutorial" → pasos con imágenes y descripciones cortas.
  - [ ] Primer ingreso tras registro → lanza tutorial automáticamente, con opción de saltar.
  - [ ] Offline → muestra la versión cacheada localmente sin requerir red.
- **Notas:** ________________________

### HU0026 — Gestión de versiones de la app (forzar actualización)  ·  E09
- **Rol:** Administrador (pantalla en el cliente móvil) · **Plataforma:** 📱 Móvil
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Versión obsoleta (< mínima soportada) → pantalla bloqueante con "Actualizar ahora" + enlace al store.
  - [ ] Versión nueva opcional → aviso no bloqueante (actualizar o continuar).
  - [ ] Cambio de versión mínima desde panel se propaga < 5 min sin redesplegar la app *(parte admin/backend)*.
- **Notas:** ________________________

### HU0028 — Funcionar en dispositivos de gama media/baja  ·  E09
- **Rol:** Agricultor · **Plataforma:** 📱 Móvil *(no funcional)*
- **Pantalla/Componente:** _(transversal)_
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Soporta Android 8.0+ sin pérdida de funcionalidad crítica.
  - [ ] Con 2 GB RAM → consumo de memoria < 250 MB en operación normal.
  - [ ] APK ≤ 60 MB y soporta instalación "lite".
- **Notas:** ________________________

### HU0031 — Generar reporte PDF mensual del cultivo  ·  E06
- **Rol:** Agricultor · **Plataforma:** 📱 Móvil
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Con detecciones en el mes → PDF con resumen, gráficas, conteo por plaga y firma digital.
  - [ ] Mes sin detecciones → PDF con "Sin detecciones registradas en este periodo".
  - [ ] Compartir → permite enviar por correo, WhatsApp u otras apps del dispositivo.
- **Notas:** ________________________

### HU0034 — Limpiar almacenamiento local  ·  E03
- **Rol:** Agricultor · **Plataforma:** 📱 Móvil
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] "Liberar espacio" → borra fotos sincronizadas > 30 días, conserva metadatos, muestra espacio recuperado.
  - [ ] Limpieza automática programada (semanal/mensual) en background.
  - [ ] Si borra > 100 archivos → modal de confirmación con conteo y tamaño total.
- **Notas:** ________________________

### HU0035 — Modo de interfaz oscura  ·  E08
- **Rol:** Agricultor · **Plataforma:** 📱 Móvil *(verificar también en web si aplica)*
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Activación manual desde preferencias → aplica paleta oscura en toda la app y persiste entre sesiones.
  - [ ] Modo "Automático" → sigue el tema del SO (día/noche) sin reiniciar.
  - [ ] Mantiene contraste WCAG AA en textos y botones.
- **Notas:** ________________________

### HU0036 — Compresión de imágenes antes de subir (cliente)  ·  E03
- **Rol:** Desarrollador · **Plataforma:** 📱 Móvil
- **Pantalla/Componente:** _(lógica de subida)_
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Compresión activa por defecto → ≤ 800 KB conservando ≥ 90% de calidad útil.
  - [ ] Bypass para admin ("subida sin compresión") → envía archivo original.
  - [ ] Imagen comprimida corrupta → descarta y reintenta con el original.
- **Notas:** ________________________

### HU0045 — Subir foto desde la galería  ·  E02
- **Rol:** Agricultor · **Plataforma:** 📱 Móvil
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Con permiso de galería → elige imagen y la envía al flujo de validación/diagnóstico.
  - [ ] Formato no soportado (≠ JPG/PNG/WEBP) → mensaje "Formato no soportado".
  - [ ] Imagen > 10 MB → la comprime automáticamente o sugiere elegir otra.
- **Notas:** ________________________

### HU0046 — Base de datos local SQLite (cola de pendientes)  ·  E03
- **Rol:** Desarrollador · **Plataforma:** 📱 Móvil
- **Pantalla/Componente:** _(capa de datos local)_
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Captura sin conexión → persiste en SQLite con estado "pendiente", timestamp y metadatos.
  - [ ] Múltiples pendientes → procesa en FIFO actualizando estados (subiendo/subido/error).
  - [ ] Resiliencia: si la app se cierra a media sincronización, reanuda desde la última no completada.
- **Notas:** ________________________

### HU0047 — Notificaciones push relevantes del cultivo  ·  E07
- **Rol:** Agricultor · **Plataforma:** 📱 Móvil
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Recibe push y al tocarla abre la sección correspondiente.
  - [ ] Preferencias → habilitar/deshabilitar tipos (alertas, recordatorios, novedades) por canal (push, correo).
  - [ ] Permisos denegados → banner dentro de la app sugiriendo activarlos.
- **Notas:** ________________________

---

## 4. 🔁 BLOQUE MÓVIL + WEB (17 HU)

> Estas deben verificarse **en ambas plataformas**. Usa las dos casillas de estado.

### HU0001 — Registro con datos básicos  ·  E01
- **Rol:** Agricultor · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Datos válidos → crea cuenta, persiste perfil y redirige a pantalla principal.
  - [ ] Datos incompletos/correo inválido → validación específica por campo, no crea cuenta.
  - [ ] Correo ya registrado → "Este correo ya está registrado" + sugiere iniciar sesión/recuperar.
- **Notas:** ________________________

### HU0002 — Inicio de sesión seguro  ·  E01
- **Rol:** Agricultor · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Credenciales válidas → autentica, genera JWT, redirige al dashboard.
  - [ ] Credenciales incorrectas → "Usuario o contraseña incorrectos" (sin revelar cuál).
  - [ ] 5 intentos fallidos → bloqueo temporal de 15 min + log de seguridad.
- **Notas:** ________________________

### HU0006 — Validar que la imagen sea una hoja de café  ·  E02
- **Rol:** Agricultor · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Hoja reconocida → permite continuar al diagnóstico.
  - [ ] Rechazada (objeto/persona/paisaje) → "No se detectó una hoja de café" + pide nueva captura.
  - [ ] Confianza 50–70% → permite continuar pero advierte que el resultado puede no ser confiable.
- **Notas:** ________________________

### HU0008 — Ver nivel de confianza (%)  ·  E02
- **Rol:** Agricultor · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Muestra el % junto al nombre de la plaga (ej. "Roya — 87%").
  - [ ] Confianza ≥ 80% → indicador verde + recomendación automática.
  - [ ] Confianza < 60% → indicador amarillo + sugiere otra foto o consultar técnico.
- **Notas:** ________________________

### HU0009 — Recuadro/marcador sobre la zona afectada (bounding box)  ·  E02
- **Rol:** Agricultor · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Con coordenadas → dibuja recuadro sobre la zona afectada en la imagen original.
  - [ ] Varias zonas → un recuadro por zona, con etiqueta y % individual.
  - [ ] Sin coordenadas → muestra diagnóstico textual + aviso "No se pudo localizar la zona afectada".
- **Notas:** ________________________

### HU0020 — Historial de detecciones por fecha  ·  E06
- **Rol:** Agricultor · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Con detecciones → lista de más reciente a más antigua, con miniatura y diagnóstico.
  - [ ] Sin detecciones → estado vacío con CTA para la primera detección.
  - [ ] Tap en una entrada → detalle: imagen completa, plaga, confianza, recomendaciones y fecha.
- **Notas:** ________________________

### HU0021 — Filtrar historial por tipo de plaga  ·  E06
- **Rol:** Agricultor · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Filtro por plaga → muestra solo esas detecciones, cronológicas.
  - [ ] Sin resultados → "No se encontraron detecciones de [Plaga]" + permite limpiar filtro.
  - [ ] Combinación plaga + rango de fechas → intersección de ambos criterios.
- **Notas:** ________________________

### HU0022 — Confirmar o rechazar el diagnóstico  ·  E06
- **Rol:** Agricultor · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] "Confirmar" → marca "validada por usuario" e incluye en feedback loop.
  - [ ] "Rechazar" + corrección → guarda corrección y la envía a revisión del admin.
  - [ ] "No estoy seguro" → marca para revisión humana sin alterar ground truth.
- **Notas:** ________________________

### HU0029 — Recomendaciones de tratamiento por plaga  ·  E02
- **Rol:** Agricultor · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Con tratamiento en catálogo → pasos numerados con dosis, frecuencia y producto.
  - [ ] Sin tratamiento → "Consulta a un técnico SENASA / cooperativa" + enlace de contacto.
  - [ ] Contextualizado por variedad/edad del cultivo registrado.
- **Notas:** ________________________

### HU0030 — Ficha informativa de la plaga (fotos de referencia)  ·  E02
- **Rol:** Agricultor · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Ficha completa → nombre científico, síntomas, fotos de referencia y ciclo de vida.
  - [ ] Ficha incompleta → muestra lo disponible + "Información en construcción".
  - [ ] Acceso desde catálogo general (sin diagnóstico previo).
- **Notas:** ________________________

### HU0038 — Mantener sesión activa (recordar sesión)  ·  E01
- **Rol:** Usuario registrado · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Access token por expirar + refresh válido → renueva silenciosamente.
  - [ ] Refresh expirado → redirige a login con "Tu sesión expiró...".
  - [ ] Tokens en almacenamiento seguro (Keystore/Keychain), nunca en claro.
- **Notas:** ________________________

### HU0039 — Recuperar contraseña olvidada  ·  E01
- **Rol:** Usuario registrado · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Correo válido → envía token de un solo uso válido 30 min.
  - [ ] Correo no registrado → mensaje genérico ("Si el correo existe, recibirás instrucciones").
  - [ ] Token expirado/usado → "Enlace inválido o expirado" + permite pedir otro.
- **Notas:** ________________________

### HU0040 — Cambiar contraseña desde el perfil  ·  E01
- **Rol:** Usuario registrado · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Contraseña actual correcta + nueva válida → actualiza, invalida sesiones activas y notifica por correo.
  - [ ] Contraseña actual incorrecta → error sin permitir cambio + registra intento.
  - [ ] Validación de fortaleza en tiempo real (mín. 8, 1 número, 1 mayúscula).
- **Notas:** ________________________

### HU0041 — Editar perfil  ·  E01
- **Rol:** Usuario registrado · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Edita nombre/teléfono/región → valida y confirma.
  - [ ] Cambio de correo → enlace de verificación al nuevo correo; aplica solo tras confirmar.
  - [ ] Datos inválidos → marca campo en rojo con motivo, no envía.
- **Notas:** ________________________

### HU0042 — Registrar cultivos (especie, variedad, siembra)  ·  E05
- **Rol:** Agricultor · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Campos obligatorios completos → persiste en Crop Service y asocia al perfil.
  - [ ] Fecha de siembra futura o > 30 años → error de validación.
  - [ ] Al elegir especie → autocompleta catálogo de variedades.
- **Notas:** ________________________

### HU0043 — Editar detalles del cultivo  ·  E05
- **Rol:** Agricultor · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Cultivo propio → actualiza y muestra toast de confirmación.
  - [ ] Edición concurrente → aviso de conflicto con "Sobrescribir" o "Recargar".
  - [ ] Edición offline → guarda en cola local y sincroniza al recuperar conexión.
- **Notas:** ________________________

### HU0044 — Eliminar cultivo  ·  E05
- **Rol:** Agricultor · **Plataforma:** 🔁 Móvil + Web
- **Pantalla/Componente:** ________________________
- **Estado Móvil:** ☐✅ ☐🟡 ☐❌  ·  **Estado Web:** ☐✅ ☐🟡 ☐❌
- **Criterios:**
  - [ ] Eliminar + confirmar en modal → borrado lógico (soft delete), conserva historial fitosanitario.
  - [ ] Restaurar dentro de 30 días desde "Cultivos eliminados".
  - [ ] Cultivo con detecciones → marca detecciones como "cultivo eliminado", no las pierde.
- **Notas:** ________________________

---

## 5. 🌐 BLOQUE WEB (21 HU)

### HU0003 — Lista de usuarios registrados (admin)  ·  E01
- **Rol:** Administrador · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Tabla paginada (20/pág) con nombre, correo, rol, fecha de registro y estado.
  - [ ] Búsqueda/filtros por rol/estado → resultados < 2 s.
  - [ ] Sin usuarios → estado vacío "No hay usuarios registrados".
- **Notas:** ________________________

### HU0014 — Repositorio de imágenes para investigador  ·  E04
- **Rol:** Investigador · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Con rol investigador → imágenes anonimizadas con metadatos (fecha, región, plaga sugerida).
  - [ ] Filtros por fecha y plaga → resultados paginados, fecha descendente.
  - [ ] Anonimización: remueve PII (nombre, correo, GPS exacto) antes de entregar.
- **Notas:** ________________________

### HU0015 — Filtrar y depurar imágenes (admin)  ·  E04
- **Rol:** Administrador · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Marcar una/varias como "inválida" → estado "descartada", excluida del próximo entrenamiento.
  - [ ] Auto-detección de baja calidad (< 480p o borrosa) → marca para revisión manual.
  - [ ] Restaurar imagen descartada por error → vuelve al pool + registra en auditoría.
- **Notas:** ________________________

### HU0016 — Lanzar re-entrenamiento del modelo (panel)  ·  E04
- **Rol:** Administrador · **Plataforma:** 🌐 Web *(UI dispara pipeline backend)*
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] ≥ 500 imágenes validadas → "Iniciar re-entrenamiento" dispara pipeline + muestra progreso por etapas.
  - [ ] Al terminar → notifica por correo con métricas (accuracy, precision, recall, F1) + enlace.
  - [ ] "Cancelar" → detiene job, libera recursos, conserva modelo anterior.
- **Notas:** ________________________

### HU0017 — Comparar métricas entre versiones del modelo  ·  E04
- **Rol:** Administrador · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Tabla comparativa: accuracy, precision, recall, F1 y matriz de confusión por clase.
  - [ ] Diferencias > 1% → verde para mejoras, rojo para regresiones.
  - [ ] "Promover a producción" / "Descartar" → registra decisión, motivo y usuario.
- **Notas:** ________________________

### HU0019 — Etiquetar manualmente imágenes mal clasificadas  ·  E04
- **Rol:** Administrador · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Interfaz muestra imagen + predicción + selector con todo el catálogo de plagas.
  - [ ] "Guardar y siguiente" → almacena etiqueta como ground truth para el próximo dataset.
  - [ ] "Otro / no clasificable" → descarta del entrenamiento y manda a revisión científica.
- **Notas:** ________________________

### HU0023 — Descargar detecciones en CSV/Excel (investigador)  ·  E06
- **Rol:** Investigador · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] "Exportar a CSV" → archivo con id, fecha, plaga, confianza, región anonimizada.
  - [ ] Formato XLSX → dos hojas: "Datos" y "Metadatos del filtro aplicado".
  - [ ] > 100.000 registros → procesa en background y envía enlace por correo.
- **Notas:** ________________________

### HU0024 — Exportar historial completo del sistema (admin)  ·  E06
- **Rol:** Administrador · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] "Exportar todo" → filtros por región, fechas y plaga → genera archivo.
  - [ ] Uso interno → incluye columnas extra (id agricultor, cooperativa, estado de validación).
  - [ ] Exportación programada (semanal/mensual) → genera y envía al correo configurado.
- **Notas:** ________________________

### HU0032 — Métricas de confusión (FP vs FN) en panel  ·  E04
- **Rol:** Administrador · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Matriz de confusión con conteos absolutos y % por clase.
  - [ ] Par con confusión > 10% → resaltado + sugiere más datos de esas clases.
  - [ ] Filtro por periodo → recalcula con detecciones del rango.
- **Notas:** ________________________

### HU0048 — Acceder a la plataforma web desde el navegador  ·  E08
- **Rol:** Usuario registrado · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Chrome/Firefox/Edge/Safari (2 últimas versiones) → carga sin advertencias.
  - [ ] Navegador obsoleto (IE) → pantalla de aviso recomendando navegadores actualizados.
  - [ ] Login unificado con la app móvil (mismo Auth Service, mismos roles/permisos).
- **Notas:** ________________________

### HU0049 — Escaneo subiendo imagen desde la web  ·  E02
- **Rol:** Agricultor · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Arrastrar/seleccionar archivo válido → envía al Detection Service y muestra resultado en la misma vista.
  - [ ] Varias imágenes en lote → procesa en paralelo (hasta 5) + tabla de resultados individuales.
  - [ ] Cancelar/cerrar pestaña → aborta peticiones en vuelo, no guarda parciales como definitivos.
- **Notas:** ________________________

### HU0050 — Dashboard web con gráficas de incidencia mensual  ·  E06
- **Rol:** Agricultor · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] ≥ 1 detección → barras por mes + torta por distribución de plaga.
  - [ ] Filtros (fechas, cultivo, plaga) → gráficas se actualizan reactivamente sin recargar.
  - [ ] Sin datos en el periodo → estado vacío con sugerencia de ampliar rango.
- **Notas:** ________________________

### HU0051 — Panel de administración web (usuarios/roles/permisos)  ·  E01
- **Rol:** Administrador · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] CRUD de usuarios + asignar roles.
  - [ ] Auditoría: registra qué cambió, quién y desde qué IP.
  - [ ] Bloquea auto-eliminación → "No puedes eliminar tu propia cuenta".
- **Notas:** ________________________

### HU0052 — Mapas de calor de distribución de plagas  ·  E08
- **Rol:** Investigador · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Detecciones georreferenciadas → heatmap con intensidad proporcional al conteo.
  - [ ] Filtros por plaga y fecha → actualiza el mapa en tiempo real.
  - [ ] Privacidad: agrega coordenadas a grilla de baja granularidad (oculta ubicación exacta).
- **Notas:** ________________________

### HU0053 — Reportes consolidados desde la web (PDF/Excel)  ·  E06
- **Rol:** Administrador · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Filtros (fecha/zona/plaga) → archivo con resumen ejecutivo, tablas y gráficas.
  - [ ] Reporte programado → genera y envía al correo/lista de distribución.
  - [ ] Sin datos → avisa y permite generar con nota "Sin datos en el periodo".
- **Notas:** ________________________

### HU0054 — Notificaciones en el navegador (Web Push)  ·  E07
- **Rol:** Agricultor · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] "Recibir alertas" → pide permisos y registra la suscripción en Notification Service.
  - [ ] Brote en su zona → notificación incluso con la pestaña cerrada (navegador abierto).
  - [ ] Cancelar suscripción → deja de enviar alertas a ese cliente.
- **Notas:** ________________________

### HU0055 — Gestionar catálogo de plagas (admin web)  ·  E08
- **Rol:** Administrador · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Alta de plaga (nombre, descripción, fotos, tratamiento) → la habilita para detecciones/etiquetado.
  - [ ] Editar/desactivar → aplica cambios o inactiva sin borrar histórico.
  - [ ] Validación: bloquea guardado si faltan campos obligatorios (nombre, fotos).
- **Notas:** ________________________

### HU0056 — Carga masiva de imágenes históricas (web)  ·  E04
- **Rol:** Investigador · **Plataforma:** 🌐 Web
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Sube ZIP + archivo de etiquetas → "Procesar lote" extrae, valida e integra al dataset.
  - [ ] Reporte por archivo: OK vs error con motivo específico.
  - [ ] Lote grande (> 1000) → procesa en background y notifica por correo al terminar.
- **Notas:** ________________________

### HU0057 — Web responsiva (tablets y laptops)  ·  E08
- **Rol:** Usuario registrado · **Plataforma:** 🌐 Web *(no funcional)*
- **Pantalla/Componente:** _(transversal)_
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Resolución ≥ 768px → reorganiza layout sin scroll horizontal.
  - [ ] Tablet → gestos táctiles (tap, swipe, pinch) sin depender de hover.
  - [ ] Pasa regresión visual en 768px, 1024px, 1440px y 1920px.
- **Notas:** ________________________

### HU0064 — Configurar reglas de alerta automática (admin)  ·  E07
- **Rol:** Administrador · **Plataforma:** 🌐 Web *(formulario; motor es backend)*
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Crear regla (zona, plaga, umbral, ventana temporal, canales) → persiste y empieza a evaluarse.
  - [ ] Umbral superado → dispara alerta a canales/destinatarios configurados.
  - [ ] Anti-flooding → cooldown configurable (24h por defecto).
- **Notas:** ________________________

### HU0070 — Panel de monitoreo de microservicios (admin)  ·  E09
- **Rol:** Administrador · **Plataforma:** 🌐 Web *(observabilidad)*
- **Pantalla/Componente:** ________________________
- **Estado:** ☐✅ ☐🟡 ☐❌ ☐➕
- **Criterios:**
  - [ ] Panel con uptime, latencia, tasa de error y healthcheck por servicio en tiempo real.
  - [ ] Indicador sobre umbral → servicio en rojo + dispara alerta al canal.
  - [ ] Histórico de incidentes → línea de tiempo, métricas y duración.
- **Notas:** ________________________

---

## Anexo §5 — ⚙️ Backend / Infra / ML (FUERA del barrido de front)

> No las busques como pantallas. Se listan para que sepas por qué quedaron fuera y para detectar los "ganchos" que sí tocan el front.

| HU | Qué es | Gancho con el front (si lo hay) |
|---|---|---|
| HU0004 | Rol/permisos especiales de investigador (autorización) | El front solo refleja accesos permitidos/denegados |
| HU0013 | Alertas si el Detection Service cae (monitoreo) | — |
| HU0018 | Despliegue blue-green del modelo (cero downtime) | — |
| HU0027 | Captura de logs de crashes | **Móvil:** integrar SDK de crash reporting en la app |
| HU0033 | Rollback del modelo | — |
| HU0037 | Monitoreo de latencia de inferencia (Prometheus/Grafana) | — |
| HU0058 | Auth Service (microservicio aislado) | Sustenta login/registro del front |
| HU0059 | Auth Service OAuth2 + JWT + refresh tokens | Sustenta HU0038 (recordar sesión) |
| HU0060 | Detection Service (microservicio) | Sustenta el diagnóstico |
| HU0061 | Detection Service API REST + OpenAPI/Swagger | Contrato que consume el front |
| HU0062 | Circuit breaker + fallback | **Móvil:** ante HTTP 503, ofrecer guardar offline y reintentar |
| HU0063 | Notification Service (microservicio) | Sustenta push/web push/correo |
| HU0065 | Sync Service (microservicio) | Sustenta la sincronización del móvil |
| HU0066 | Sync Service + cola de mensajes (RabbitMQ) | — |
| HU0067 | Report Service (microservicio) | Sustenta reportes/exportaciones |
| HU0068 | Reporte PDF mensual automático por correo | **Front:** toggle de suscripción en "Preferencias" |
| HU0069 | ML Training Service (microservicio) | Sustenta HU0016 |
| HU0071 | API Gateway (punto único de entrada) | El front llama al gateway |
| HU0072 | Rate limiting por usuario/IP | El front debe manejar HTTP 429 + Retry-After |
| HU0073 | Crop Service (microservicio + BD propia) | Sustenta HU0042–44 |
| HU0074 | Distributed tracing (OpenTelemetry) | — |
| HU0075 | Versionado de modelos (DVC / Git LFS) | — |

---

## §6 — Funcionalidades "de más" encontradas en la app

> Registra aquí todo lo que exista en tu app/web y **no** corresponda a ninguna HU. Esto cubre el "qué está de más" del cotejo.

| # | Plataforma | Pantalla/Función | ¿Mantener, documentar o quitar? |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## §7 — Resumen de cobertura (llenar al final)

| Categoría | Total | ✅ Cumple | 🟡 Parcial | ❌ Falta | % Cobertura |
|---|---|---|---|---|---|
| 📱 Móvil | 15 | | | | |
| 🔁 Móvil+Web (móvil) | 17 | | | | |
| 🔁 Móvil+Web (web) | 17 | | | | |
| 🌐 Web | 21 | | | | |
| **Front total** | **53** | | | | |

**Conclusiones / pendientes priorizados:**
1. ________________________
2. ________________________
3. ________________________
