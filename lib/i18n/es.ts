/**
 * Tabla de strings UI en español peruano (es-PE).
 * Mantener todas las cadenas visibles aquí — facilita revisar tono y agregar
 * locales adicionales en el futuro sin tocar componentes.
 */

export const t = {
  brand: {
    wordmark: "AYNI",
    product: "Agri-tech · Admin",
    tagline: "Cuida cada hoja.",
    taglineBody:
      "Ayni significa reciprocidad en quechua. Detectamos a tiempo lo que la hoja calla, y devolvemos al caficultor el cuidado de su cosecha.",
    location: "Selva alta · Villa Rica, Pasco",
    coords: "-10.71°, -75.35°",
  },

  login: {
    title: "Bienvenido de nuevo",
    subtitle: "Ingresa tus credenciales para acceder al panel de gestión.",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "admin@ayni.pe",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "••••••••",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    submit: "Iniciar sesión",
    submitting: "Ingresando…",
    restricted:
      "Acceso exclusivo para administradores de cooperativas, agrónomos y técnicos SENASA.",
    errors: {
      forbidden: "Este panel es solo para administradores o agrónomos.",
      invalidCredentials:
        "Credenciales inválidas. Verifica tu correo y contraseña.",
      generic: "No se pudo iniciar sesión. Intenta de nuevo.",
    },
  },

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
    copy: "Copiar",
    copied: "¡Copiado!",
    delete: "Eliminar",
    save: "Guardar cambios",
    saving: "Guardando…",
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
    searching: "Buscando…",
    noResults: (q: string) => `Sin resultados para "${q}".`,
    groupPlagues: "Plagas",
    groupFarmers: "Caficultores",
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
    confirmDiagnosis: "Confirmar diagnóstico",
    rejectImage: "Rechazar imagen",
    nextOrSkip: "Siguiente / Omitir",
    savePage: "Guardar cambios (Ctrl+S)",
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
    form: {
      createTitle: "Crear usuario",
      createSubtitle: "Registra un nuevo usuario y asígnale un rol.",
      editTitle: "Editar usuario",
      editSubtitle: "Actualiza el rol o el estado de la cuenta.",
      viewTitle: "Perfil del usuario",
      fullName: "Nombre completo",
      fullNamePlaceholder: "Ej. María Quispe",
      email: "Correo electrónico",
      emailPlaceholder: "usuario@ayni.pe",
      emailHint: "Se usará para iniciar sesión.",
      password: "Contraseña",
      passwordPlaceholder: "Mínimo 8 caracteres",
      passwordHint:
        "Compártela de forma segura; el usuario podrá cambiarla luego.",
      role: "Rol",
      status: "Estado",
      submitCreate: "Crear usuario",
      submitEdit: "Guardar cambios",
      creating: "Creando…",
      saving: "Guardando…",
      required: "Este campo es obligatorio.",
      invalidEmail: "Ingresa un correo válido.",
      passwordTooShort: "La contraseña debe tener al menos 8 caracteres.",
      createError:
        "No se pudo crear el usuario. Verifica los datos e inténtalo de nuevo.",
      updateError: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
    },
    profile: {
      community: "Comunidad",
      lastActivity: "Última actividad",
      noCommunity: "Sin comunidad registrada",
    },
    confirmDeleteTitle: "Eliminar cuenta",
    confirmDeleteBody: (name: string) =>
      `La cuenta de ${name} se eliminará permanentemente y no podrá recuperarse.`,
    tempPassword: {
      title: "Contraseña temporal",
      subtitle: (name: string) => `Generada para ${name}. Compártela de forma segura.`,
      hint: "El usuario deberá cambiarla en su próximo inicio de sesión.",
      copy: "Copiar contraseña",
      copied: "¡Copiada!",
    },
    toasts: {
      created: "Usuario creado correctamente.",
      updated: "Cambios guardados.",
      deleted: "Cuenta eliminada.",
      passwordReset: "Contraseña temporal generada.",
    },
    emptyStateBody: "Intenta ajustar los filtros o crea un nuevo usuario.",
    emptyStateCta: "Crear usuario",
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
      editNotAvailable: "Edición de plagas no disponible aún.",
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
    navLabel: "Menú de navegación",
    openMenu: "Abrir menú",
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
      modelConfidence: "Confianza media del modelo",
    },
    recentDiagnoses: "Diagnósticos recientes",
    recentDiagnosesDesc:
      "Últimas detecciones sincronizadas desde el campo en Villa Rica.",
    systemStatus: "Estado de servicios",
    systemStatusDesc: "Salud e infraestructura en vivo.",
    viewAll: "Ver todo",
    loadingDiagnoses: "Cargando diagnósticos…",
    noDiagnoses: "Aún no hay diagnósticos registrados.",
    sourceSynced: "Offline",
    sourceLive: "En vivo",
    healthy: "Sana",
    systemStatusPreview:
      "Vista previa — el monitoreo en vivo se conecta en Monitoreo.",
    goToMonitoring: "Ir a Monitoreo",
    labelingQueue: "Cola de etiquetado",
    labelingCta: "Mejora el dataset del modelo",
    labelingBody: (n: number) =>
      `${n} diagnóstico${n === 1 ? "" : "s"} con confianza < 60 % requieren validación experta.`,
    validateImages: "Validar imágenes",
    severityLabel: {
      high: "Severidad alta",
      medium: "Severidad media",
      healthy: "Planta sana",
    },
  },

  diagnosesPage: {
    title: "Historial de Diagnósticos",
    description:
      "Consulta y filtra todos los diagnósticos realizados en campo y sincronizados.",
    searchPlaceholder: "Buscar por caficultor, finca o plaga…",
    viewMap: "Ver mapa de calor",
    exportData: "Exportar historial",
    tabList: "Lista",
    tabZone: "Por zona",
    loadingHistory: "Cargando historial…",
    errorHistory: "No se pudo cargar el historial.",
    emptyHistory: "No hay diagnósticos para los filtros seleccionados.",
    toasts: {
      exportError: "No se pudo exportar el historial.",
    },
  },

  validationPage: {
    title: "Cola de Validación",
    description:
      "Revisa y confirma las clasificaciones de plagas detectadas por el modelo para mejorar el dataset.",
    pendingCount: (count: number) => `Imágenes pendientes: ${count}`,
    confirmLabel: "Confirmar etiqueta",
    rejectLabel: "Rechazar imagen",
    confirmedTitle: "Diagnóstico validado",
    confirmedBody:
      "La etiqueta fue confirmada y se usará para retroalimentar el dataset del modelo ML.",
    rejectedTitle: "Imagen rechazada",
    rejectedBody:
      "El diagnóstico se descartó de la cola y no se usará para entrenamiento.",
    queueComplete: "Has completado la cola de validación.",
    nextImage: "Siguiente imagen",
    skipImage: "Omitir imagen",
    queueCount: (n: number, total: number) =>
      `${n} en cola${total > n ? ` (de ${total})` : ""}`,
    noQueue: "No hay diagnósticos pendientes de validación.",
    loadingQueue: "Cargando cola de validación…",
    errorQueue: "No se pudo cargar la cola de validación.",
    shortcuts: {
      confirm: "Confirmar diagnóstico",
      reject: "Rechazar imagen",
      next: "Siguiente / Omitir",
      help: "Mostrar atajos",
    },
  },

  alertsPage: {
    title: "Alertas Fitosanitarias",
    description:
      "Configura reglas de alerta fitosanitaria y destinatarios para incidentes críticos.",
    createRule: "Crear regla",
    rulesList: "Reglas activas",
    confirmDeleteTitle: "Eliminar regla",
    confirmDeleteBody: (name: string) =>
      `La regla "${name}" se eliminará de forma permanente.`,
    loading: "Cargando reglas…",
    error: "No se pudieron cargar las reglas.",
    empty: "Aún no hay reglas de alerta. Crea la primera.",
    stats: {
      active: "Reglas activas",
      paused: "Reglas pausadas",
      total: "Total de reglas",
    },
    form: {
      title: "Nueva regla de alerta",
      name: "Nombre",
      namePlaceholder: "Roya severa Villa Rica",
      pest: "Plaga",
      threshold: (n: number) => `Umbral de severidad: ${n}%`,
      zone: "Zona (opcional)",
      zonePlaceholder: "Sector San Miguel",
      recipients: "Destinatarios (correos, separados por coma)",
      recipientsPlaceholder: "agronomo@ayni.pe",
      submit: "Crear regla",
      creating: "Creando…",
      error: "No se pudo crear (¿permisos de admin/agrónomo?).",
    },
    toasts: {
      created: "Regla creada correctamente.",
      deleted: "Regla eliminada.",
      toggled: (active: boolean) =>
        active ? "Regla activada." : "Regla pausada.",
    },
  },

  pipelinePage: {
    title: "Pipeline de Machine Learning",
    description:
      "Estado operativo de la arquitectura de dos etapas para localización de hojas y clasificación de plagas.",
    stage1Title: "Etapa 1: Localización y Bounding Boxes",
    stage1Desc:
      "Modelo YOLOv8 para recortar la hoja de café eliminando ruido de fondo.",
    stage2Title: "Etapa 2: Clasificación de Plaga y Gravedad",
    stage2Desc:
      "Modelo SmallPavicNet-MC / EfficientNet-B0 para inferir la plaga y estimar daño.",
    metrics: {
      map: "mAP@50",
      f1: "F1-Score",
      latency: "Latencia",
      dataset: "Dataset",
    },
    loading: "Cargando modelos…",
    error: "No se pudo cargar el pipeline.",
    truncatedLabel: "RECORTADA",
    historyTitle: "Historial de versiones",
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
    loading: "Cargando servicios…",
    error: "No se pudo cargar el estado de servicios.",
    noServices: "No hay servicios registrados.",
    cpuNote: "CPU/RAM por servicio: no expuesto en esta versión.",
    actionsNote:
      "Las acciones de control (reiniciar servicios, purgar colas) no están disponibles desde el panel; se gestionan en la plataforma de despliegue.",
    actions: {
      purge: "Purgar colas de sync",
      restartKafka: "Reiniciar Brokers de Kafka",
      downloadLogs: "Descargar logs",
      notAvailable: "No disponible desde el panel",
    },
    summary: {
      services: "Servicios",
      servicesHint: "registrados en Eureka",
      online: "En línea",
      onlineHint: "estado UP",
      latency: "Latencia media",
      latencyHint: "health-check",
      infrastructure: "Infraestructura",
      infrastructureHint: "MySQL/Kafka/Eureka",
    },
  },

  serviceStatus: {
    up: "EN LÍNEA",
    down: "CAÍDO",
  },

  notifications: {
    title: "Notificaciones",
    titleWithCount: (n: number) => `Notificaciones (${n})`,
    markAllRead: "Marcar todas como leídas",
    loading: "Cargando…",
    error: "No se pudieron cargar las notificaciones.",
    empty: "No tienes notificaciones pendientes.",
  },

  reportsPage: {
    title: "Reportes Fitosanitarios",
    description:
      "Genera documentos oficiales consolidados para SENASA y exportaciones de incidentes.",
    configureTitle: "Configurar Reporte",
    recentTitle: "Documentos Recientes",
    recentDesc:
      "Historial de reportes generados. La descarga se habilita cuando el estado es \"Listo\".",
    loading: "Cargando historial…",
    error: "No se pudo cargar el historial de reportes.",
    empty: "Aún no hay reportes generados.",
    privacyTitle: "Cumplimiento de Privacidad",
    privacyLaw: "Ley de Protección de Datos Personales (Ley N.º 29733)",
    anonymize:
      "Anonimizar nombres y coordenadas (SENASA y zona se anonimizan siempre)",
    toasts: {
      generated:
        "Reporte en cola. Aparecerá en la lista cuando esté listo.",
      downloadError: "No se pudo descargar el reporte.",
      generateError: "No se pudo generar el reporte.",
    },
  },

  configuracionPage: {
    title: "Configuración",
    description: "Gestiona tu perfil y la seguridad de tu cuenta.",
    profileCard: {
      title: "Datos personales",
      subtitle: "Tu nombre visible en el panel.",
      emailLabel: "Correo electrónico (no editable)",
      roleLabel: "Rol (asignado por un administrador)",
      saving: "Guardando…",
      save: "Guardar cambios",
      saved: "Perfil actualizado",
      showName: "Mostrar nombre",
      hideName: "Ocultar nombre",
    },
    passwordCard: {
      title: "Seguridad",
      subtitle: "Cambia tu contraseña de acceso.",
      currentLabel: "Contraseña actual",
      newLabel: "Nueva contraseña",
      confirmLabel: "Confirmar nueva contraseña",
      changing: "Actualizando…",
      change: "Cambiar contraseña",
      changed: "Contraseña actualizada",
      showCurrent: "Mostrar contraseña actual",
      hideCurrent: "Ocultar contraseña actual",
      showNew: "Mostrar nueva contraseña",
      hideNew: "Ocultar nueva contraseña",
      showConfirm: "Mostrar confirmación",
      hideConfirm: "Ocultar confirmación",
    },
    statusCard: {
      title: "Estado de la cuenta",
      statusLabel: "Estado",
      statusActive: "Activa",
      statusInactive: "Inactiva",
      consentLabel: "Consentimiento de datos (Ley 29733)",
      consentGranted: "Otorgado",
      consentGrantedDate: (d: string) => `Otorgado el ${d}`,
      consentNotGranted: "No otorgado",
      roleLabel: "Rol",
      memberSince: "Miembro desde",
      adminNote:
        "El estado y el rol de la cuenta los gestiona un administrador. No existe un paso adicional de verificación por correo en esta versión.",
    },
    toasts: {
      profileSaved: "Perfil actualizado correctamente.",
      profileError: "No se pudo guardar. Inténtalo de nuevo.",
      passwordChanged: "Contraseña actualizada correctamente.",
      passwordError:
        "No se pudo cambiar. Verifica la contraseña actual.",
    },
  },
} as const;
