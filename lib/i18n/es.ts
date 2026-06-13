/**
 * Tabla de strings UI en español peruano (es-PE).
 * Mantener todas las cadenas visibles aquí — facilita revisar tono y agregar
 * locales adicionales en el futuro sin tocar componentes.
 */

export const t = {
  common: {
    retry: "Reintentar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    loading: "Cargando…",
    search: "Buscar",
    clear: "Limpiar",
    close: "Cerrar",
    actions: "Acciones",
    notifications: "Notificaciones",
    settings: "Configuración",
    profile: "Perfil",
  },

  errors: {
    loadFailed: {
      title: "No pudimos cargar los datos",
      body: "Revisa tu conexión o vuelve a intentarlo en unos segundos.",
    },
    networkOffline: {
      title: "Sin conexión",
      body: "Tu dispositivo perdió conexión a internet.",
    },
  },

  header: {
    searchPlaceholder: "Buscar plagas, caficultores, alertas…",
    searchHint: "Presiona / para buscar",
  },

  shortcuts: {
    title: "Atajos de teclado",
    body: "Atajos disponibles en esta pantalla",
    focusSearch: "Enfocar búsqueda",
    clearFilters: "Limpiar filtros",
    prevPage: "Página anterior",
    nextPage: "Página siguiente",
    roleAll: "Mostrar todos",
    roleFarmer: "Solo caficultores",
    roleAgronomist: "Solo agrónomos",
    showHelp: "Mostrar atajos",
  },

  users: {
    title: "Usuarios y roles",
    description:
      "Administra caficultores, agrónomos y administradores del sistema.",
    createUser: "Crear usuario",
    searchPlaceholder: "Buscar por nombre o correo…",
    filters: "Filtros",
    tabs: {
      all: "Todos",
      farmers: "Caficultores",
      agronomists: "Agrónomos",
    },
    columns: {
      name: "Nombre",
      role: "Rol",
      community: "Comunidad",
      lastActivity: "Última actividad",
      status: "Estado",
      actions: "Acciones",
    },
    emptyState: "Ningún usuario coincide con los filtros actuales.",
    pagination: {
      summary: (from: number, to: number, total: number) =>
        `Mostrando ${from}–${to} de ${total} resultados`,
      prev: "Página anterior",
      next: "Página siguiente",
    },
    rowActions: {
      view: "Ver perfil",
      edit: "Editar usuario",
      resetPassword: "Restablecer contraseña",
      deactivate: "Desactivar cuenta",
      activate: "Reactivar cuenta",
      delete: "Eliminar cuenta",
    },
  },

  roles: {
    FARMER: "Caficultor",
    AGRONOMIST: "Agrónomo",
    ADMIN: "Administrador",
  },

  status: {
    ACTIVE: "Activo",
    INACTIVE: "Inactivo",
  },

  catalog: {
    title: "Catálogo de plagas",
    description:
      "Administra la base de datos de enfermedades y plagas del cultivo de café.",
    addPlague: "Agregar plaga",
    filterBySeverity: "Filtrar por severidad",
    filterApplied: (count: number) =>
      `Filtros activos · ${count} severidad${count === 1 ? "" : "es"}`,
    clearFilter: "Quitar filtros",
    emptyState: {
      title: "Aún no hay plagas registradas",
      body: "Comienza agregando una plaga al catálogo. Aparecerá aquí y estará disponible para los diagnósticos.",
      cta: "Agregar la primera plaga",
    },
    filteredEmpty: {
      title: "Ninguna plaga coincide con los filtros",
      body: "Ajusta los filtros de severidad o limpia la búsqueda para ver todo el catálogo.",
      cta: "Quitar filtros",
    },
    cardActions: {
      edit: "Editar plaga",
    },
    estimatedLoss: (percent: number) => `Pérdida estimada · hasta ${percent}%`,
  },

  severity: {
    CRITICAL: "Crítica",
    HIGH_RISK: "Alto riesgo",
    MODERATE: "Moderada",
    LOW: "Baja",
  },

  plagueTags: {
    FUNGUS: "Hongo",
    INSECT: "Insecto",
    BACTERIA: "Bacteria",
    LEAVES: "Hojas",
    CHERRY: "Fruto",
    ROOTS: "Raíz",
    STEM: "Tallo",
  },

  sidebar: {
    groupDiagnosis: "Diagnóstico",
    groupIntelligence: "Inteligencia",
    groupAdmin: "Administración",
    home: "Inicio",
    diagnoses: "Diagnósticos",
    validation: "Validación",
    catalog: "Catálogo de plagas",
    pipeline: "Pipeline ML",
    reports: "Reportes",
    users: "Usuarios",
    alerts: "Alertas",
    monitoring: "Monitoreo",
  },

  home: {
    title: "Inicio / Resumen",
    description:
      "Vista general de operaciones, estado fitosanitario e indicadores del modelo.",
    stats: {
      activeFarmers: "Caficultores activos",
      pendingValidation: "Pendientes de validar",
      activeAlerts: "Alertas activas",
      modelAccuracy: "Precisión del modelo",
    },
    recentDiagnoses: "Diagnósticos recientes",
    recentDiagnosesDesc:
      "Últimas detecciones sincronizadas desde el campo en Villa Rica.",
    systemStatus: "Estado de servicios",
    systemStatusDesc: "Salud e infraestructura en vivo.",
  },

  diagnosesPage: {
    title: "Historial de Diagnósticos",
    description:
      "Consulta y filtra todos los diagnósticos realizados en campo y sincronizados.",
    searchPlaceholder: "Buscar por caficultor, finca o plaga…",
    viewMap: "Ver mapa de calor",
    exportData: "Exportar historial",
  },

  validationPage: {
    title: "Cola de Validación",
    description:
      "Revisa y confirma las clasificaciones de plagas detectadas por el modelo para mejorar el dataset.",
    pendingCount: (count: number) => `Imágenes pendientes: ${count}`,
    confirmLabel: "Confirmar etiqueta",
    rejectLabel: "Rechazar imagen",
  },

  alertsPage: {
    title: "Alertas Fitosanitarias",
    description:
      "Configura reglas de alerta fitosanitaria y destinatarios para incidentes críticos.",
    createRule: "Crear regla",
    rulesList: "Reglas activas",
  },

  pipelinePage: {
    title: "Pipeline de Machine Learning",
    description:
      "Estado operativo de la arquitectura de dos etapas para localización de hojas y clasificación de plagas.",
    stage1Title: "Etapa 1: Localización y Bounding Boxes",
    stage1Desc: "Modelo YOLOv8 para recortar la hoja de café eliminando ruido de fondo.",
    stage2Title: "Etapa 2: Clasificación de Plaga y Gravedad",
    stage2Desc: "Modelo SmallPavicNet-MC / EfficientNet-B0 para inferir la plaga y estimar daño.",
    metrics: {
      map: "mAP@50",
      f1: "F1-Score",
      latency: "Latencia",
      dataset: "Dataset",
    },
  },

  monitoringPage: {
    title: "Salud del Sistema",
    description:
      "Panel de observabilidad en vivo para administradores de sistemas: infraestructura, microservicios y colas de sincronización.",
    metrics: {
      cpu: "Carga CPU",
      memory: "Uso Memoria",
      rps: "Tasa de Peticiones",
      syncSuccess: "Éxito de Sincronización",
    },
    sections: {
      microservices: "Estado de Microservicios",
      infrastructure: "Infraestructura y Bases de Datos",
      actions: "Acciones rápidas",
    },
  },
} as const;
