# Product

## Register

product

## Users

**Primarios:** administradores de cooperativas, agrónomos de campo, investigadores del proyecto, y técnicos SENASA. Trabajan en oficinas (no en campo) sobre laptop o tablet, con buena conexión. Su trabajo es operativo y supervisorio: ven datos que llegaron de la app móvil del caficultor.

**Job-to-be-done:**
- Validar y etiquetar manualmente imágenes recolectadas en campo para mejorar el dataset del modelo.
- Consultar historial de diagnósticos por zona geográfica, comunidad, plaga y periodo.
- Generar reportes fitosanitarios SENASA con datos anonimizados.
- Monitorear el estado del pipeline ML (precisión, latencia, versiones de modelo, rollback).
- Configurar reglas de alerta por umbral de incidencia.
- Auditar usuarios, roles y permisos del sistema.

**Contexto temporal:** sesiones largas (30 min–2 h), foco profundo, no consumo casual. La velocidad de los flujos secundarios importa menos que la claridad de los datos.

## Product Purpose

Dashboard de operaciones del sistema AYNI — la interfaz que permite a los humanos del sistema (no a los caficultores) hacer su parte del ciclo: validar lo que la IA detectó, mejorar el modelo con su criterio experto, vigilar la salud técnica del pipeline, y comunicar incidencia fitosanitaria a SENASA cuando corresponde.

**Éxito** = el agrónomo etiqueta una imagen sin pensar en la UI, el reporte SENASA se genera con un par de clics, y el admin nota un fallo del modelo antes de que afecte a un caficultor.

## Brand Personality

**Confiable · técnico · arraigado.**

- **Confiable**: las decisiones que se toman aquí afectan cosechas reales en Villa Rica. La UI nunca debe sugerir un nivel de certeza que no tiene; etiquetas claras, estados explícitos, sin ambigüedad.
- **Técnico**: los usuarios saben de café y de fitosanidad. La interfaz puede usar `Hemileia vastatrix` sin disculparse, mostrar F1-score, exponer versiones del modelo. No simplificar para abajo.
- **Arraigado**: AYNI es una palabra quechua (reciprocidad). El producto no es un SaaS global genérico; nace en Pasco y se queda en Pasco. Pequeños detalles del lenguaje y la imagen direction recuerdan eso.

Voz: clara, directa, sin marketing-speak. Los números hablan; los adjetivos no.

## Anti-references

Lo que AYNI **no** debe parecer:

- **SaaS genérico con grids de cards icon-h3-párrafo.** El patrón Salesforce/IBM de tres columnas idénticas con icono arriba, heading, dos líneas de copy. Esto convierte la interfaz en plantilla y disuelve la identidad.
- **Dark-mode techie / hacker.** Fondo negro + cyan/lime + monoespaciada decorativa. No es lo que esperan caficultores, cooperativas o SENASA al sentarse frente al dashboard.
- **Verde-cliché eco / app de plantitas.** Verde + blanco infantil, ilustraciones de hojas dibujadas a mano, look de wellness/cottagecore. AYNI es agronomía científica, no lifestyle.
- **Gov-tech pesado (peru.gob.pe / MINAGRI).** Hero rojo + banner azul institucional, dropdown menus densos, tablas sin aire, formularios de 30 campos en una pantalla. El producto trabaja con SENASA pero no se viste como ellos.

## Design Principles

1. **El dato manda, el cromo se aparta.** Cualquier badge, ícono o accent que compita visualmente con el dato concreto (un score F1, una incidencia por hectárea, un nombre de caficultor) se replantea o se elimina.

2. **Confianza calibrada.** Cuando el modelo no está seguro, la UI no está segura. Niveles de confianza, estados de sincronización y deltas de métricas se muestran con honestidad — gris/amarillo cuando aplica, verde solo cuando se ganó.

3. **Densidad con aire.** Los usuarios son operativos; quieren ver mucha información a la vez sin marearse. Tablas amplias, padding generoso por fila, jerarquía clara por peso y no por color. No card-soup, no zoom infantil.

4. **Un solo verde.** El primary `#04A033` solo se gana cuando hay un significado activo (estado positivo, CTA, item seleccionado). Si todo es verde, nada es verde. El resto del sistema vive en cream + forest + grays.

5. **Bilingüe sin fricción.** Strings de UI en español (los usuarios son peruanos), terminología técnica en su forma estándar (FARMER/AGRONOMIST/ADMIN en código, "Caficultor / Agrónomo / Admin" en pantalla). El idioma del producto sigue al usuario, no al stack.

## Accessibility & Inclusion

- **WCAG 2.1 AA mínimo** en todo el dashboard (CLAUDE.md §17 — la app móvil tiene el mismo piso).
- **Contraste** verificado: 4.5:1 body, 3:1 texto grande. El placeholder gray-3 sobre gray-5 input debe revisarse específicamente.
- **Tamaño mínimo de target** 40×40 px (el dashboard se usa en tablet — Wacom/iPad no es estándar pero existe en el campo).
- **Responsivo:** funcional en tablets ≥768 px y laptops/desktops. **No mobile-first**: el dashboard es desktop primero (los caficultores usan la app móvil; el dashboard es para operativos en oficina).
- **Reduced motion** respetado: `prefers-reduced-motion: reduce` reemplaza cualquier transición de transform/posición por crossfade o estado instantáneo.
- **Lenguaje claro** sobre datos sensibles (Ley N.º 29733): "Eliminar cuenta" no "Solicitar baja"; el botón hace lo que dice.
- **Color no es el único canal de información**: estados (Active/Inactive, plagas, severidad) siempre llevan ícono o etiqueta además del color.
