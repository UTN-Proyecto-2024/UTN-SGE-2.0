import { SgeNombre } from "@prisma/client";
import { z } from "zod";

export const ZodRuta = z.object({
  href: z.string(),
  redirectClick: z.string().optional(),
  label: z.string(),
  isPublic: z.boolean(),
  inConstruction: z.boolean().optional(),
  esExterna: z.boolean().optional(),
  permisos: z.array(z.nativeEnum(SgeNombre)),
});

export type AppBase = z.infer<typeof ZodRuta>;
export type AppRoute = AppBase & {
  subRutas?: AppRoute[];
  [x: string]: unknown;
};

export const INICIO_ROUTE: AppRoute = {
  href: "/",
  label: "Inicio",
  isPublic: true,
  permisos: [],
};

export const BIBLIOTECA_ROUTE: AppRoute = {
  href: "/biblioteca",
  label: "Biblioteca",
  isPublic: false,
  misPrestamosRuta: "/biblioteca/mis_prestamos",
  permisos: [SgeNombre.BIBLIOTECA_VER_LISTADO],
  subRutas: [
    {
      href: "/biblioteca",
      label: "Todos los libros",
      isPublic: false,
      permisos: [SgeNombre.BIBLIOTECA_VER_LISTADO],
    },
    {
      href: "/biblioteca/prestamos",
      label: "Préstamos",
      isPublic: false,
      permisos: [SgeNombre.BIBLIOTECA_PRESTAMO_PRESTAR, SgeNombre.BIBLIOTECA_PRESTAMO_PRESTAR],
    },
    {
      href: "/biblioteca/mis_prestamos",
      label: "Mis préstamos",
      isPublic: false,
      permisos: [SgeNombre.BIBLIOTECA_PRESTAMO_VER_MIS_PRESTAMOS],
    },
  ],
};

export const LABORATORIO_ROUTE: AppRoute = {
  href: "/laboratorios",
  label: "Laboratorios",
  isPublic: false,
  misReservasRuta: "/laboratorios/mis_reservas",
  permisos: [SgeNombre.RES_LAB_VER_RESERVAS_GENERALES_DOCENTES],
  subRutas: [
    {
      href: "/laboratorios/mis_cursos",
      label: "Mis cursos",
      isPublic: false,
      permisos: [SgeNombre.RES_LAB_RESERVAR_CURSO_AUTO],
    },
    {
      href: "/laboratorios/catedra",
      label: "Cátedra",
      isPublic: false,
      permisos: [SgeNombre.RES_LAB_VER_RESERVAS_CATEDRA],
    },
    {
      href: "/laboratorios/software",
      label: "Aplicaciones PC",
      isPublic: false,
      permisos: [SgeNombre.APLICACIONES_ABM],
    },
    {
      href: "/laboratorios/pantalla",
      label: "Pantalla",
      isPublic: false,
      permisos: [SgeNombre.RES_LAB_ABM_PANTALLA],
    },
    {
      href: "/laboratorios/mis_reservas",
      label: "Mis reservas",
      isPublic: false,
      permisos: [SgeNombre.RES_LAB_VER_RESERVAS_GENERALES_DOCENTES],
    },
    {
      redirectClick: "/laboratorios/solicitudes?estatus=PENDIENTE",
      href: "/laboratorios/solicitudes",
      label: "Administrar reservas",
      isPublic: false,
      permisos: [SgeNombre.RES_LAB_CONFIRMAR_RESERVAS],
    },
  ],
};

export const LABORATORIO_ABIERTO_ROUTE: AppRoute = {
  href: "/laboratorio_abierto",
  label: "Laboratorio abierto",
  isPublic: false,
  misReservaRuta: "/laboratorio_abierto/mis_reservas",
  permisos: [SgeNombre.LAB_ABIERTO_RESERVAR],
  subRutas: [
    {
      href: "/laboratorio_abierto/reservar",
      label: "Reservar",
      isPublic: false,
      permisos: [SgeNombre.LAB_ABIERTO_RESERVAR],
    },
    {
      redirectClick: "/laboratorio_abierto/solicitudes?estatus=PENDIENTE",
      href: "/laboratorio_abierto/solicitudes",
      label: "Administrar reservas",
      isPublic: false,
      permisos: [SgeNombre.LAB_ABIERTO_CONFIRMAR_RESERVAS],
    },
    {
      href: "/laboratorio_abierto/mis_reservas",
      label: "Mis reservas",
      isPublic: false,
      permisos: [SgeNombre.LAB_ABIERTO_VER_MIS_RESERVAS],
    },
    {
      href: "/laboratorio_abierto/tutores",
      label: "Tutores",
      isPublic: false,
      permisos: [SgeNombre.LAB_ABIERTO_VER_PLANILLA_TUTORES],
    },
  ],
};

export const EQUIPOS_ROUTE: AppRoute = {
  href: "/equipos",
  label: "Equipos",
  isPublic: false,
  misPrestamosRuta: "/equipos/mis_prestamos",
  permisos: [SgeNombre.EQUIPOS_VER_LISTADO],
  subRutas: [
    {
      href: "/equipos",
      label: "Todos los equipos",
      isPublic: false,
      permisos: [SgeNombre.EQUIPOS_VER_LISTADO],
    },
    {
      href: "/equipos/tipos",
      label: "Tipos",
      isPublic: false,
      permisos: [SgeNombre.EQUIPOS_ABM],
    },
    {
      href: "/equipos/prestamos",
      label: "Préstamos",
      isPublic: false,
      permisos: [SgeNombre.EQUIPOS_PRESTAMO_PRESTAR],
    },
    {
      href: "/equipos/mis_prestamos",
      label: "Mis préstamos",
      isPublic: false,
      permisos: [SgeNombre.EQUIPOS_PRESTAMO_VER_MIS_PRESTAMOS],
    },
  ],
};

export const MATERIA_ROUTE: AppRoute = {
  href: "/materias",
  label: "Materias",
  isPublic: false,
  permisos: [SgeNombre.MATERIAS_VER_LISTADO],
  subRutas: [
    {
      href: "/materias",
      label: "Todas las materias",
      isPublic: false,
      permisos: [SgeNombre.MATERIAS_VER_LISTADO],
    },
  ],
};

export const CURSOS_ROUTE: AppRoute = {
  href: "/cursos",
  label: "Cursos",
  isPublic: false,
  permisos: [SgeNombre.CURSOS_MOSTRAR_TODOS],
  subRutas: [
    {
      href: "/cursos",
      label: "Todos los cursos",
      isPublic: false,
      permisos: [SgeNombre.CURSOS_MOSTRAR_TODOS],
    },
    {
      href: "/cursos/mis_cursos",
      label: "Mis cursos",
      isPublic: false,
      permisos: [SgeNombre.CURSOS_VER_MIS_CURSOS_AUTO],
    },
    {
      href: "/cursos/divisiones",
      label: "Divisiones",
      isPublic: false,
      permisos: [SgeNombre.DIVISIONES_VER_LISTADO],
    },
  ],
};

export const ADMIN_ROUTE: AppRoute = {
  href: "/admin",
  label: "Administración",
  isPublic: false,
  permisos: [SgeNombre.ADMIN_VER_PANEL_ADMIN],
  subRutas: [
    {
      href: "/admin/roles",
      label: "Roles",
      isPublic: false,
      permisos: [SgeNombre.ADMIN_VER_PANEL_ADMIN],
    },
    {
      href: "/admin/usuarios",
      label: "Usuarios",
      isPublic: false,
      permisos: [SgeNombre.ADMIN_VER_PANEL_ADMIN],
    },
    {
      href: "/admin/laboratorios",
      label: "Laboratorios",
      isPublic: false,
      permisos: [SgeNombre.ADMIN_VER_PANEL_ADMIN],
    },
  ],
};

export const COMPROBANTE_ROUTE = {
  href: "/comprobante",
  label: "Comprobante",
  isPublic: false,
  bibliotecaRuta: {
    href: "/comprobante/biblioteca",
  },
  inventarioRuta: {
    href: "/comprobante/equipo",
  },
  laboratorioAbiertoRuta: {
    href: "/comprobante/laboratorio_abierto",
  },
};

export const REPORTES_ROUTE: AppRoute = {
  href: "/reportes",
  label: "Reportes",
  isPublic: false,
  permisos: [SgeNombre.ADMIN_VER_PANEL_ADMIN],
  subRutas: [
    {
      href: "/reportes/mes",
      label: "Mes",
      isPublic: false,
      permisos: [SgeNombre.ADMIN_VER_PANEL_ADMIN],
    },
    {
      href: "/reportes/hoy",
      label: "Hoy",
      isPublic: false,
      permisos: [SgeNombre.ADMIN_VER_PANEL_ADMIN],
    },
  ],
};

export const SGE_1_ROUTE: AppRoute[] = [
  {
    href: "https://sge.frba.utn.edu.ar/sge2/fallasreporte/falla_pc.php",
    label: "Fallas",
    esExterna: true,
    isPublic: false,
    permisos: [SgeNombre.REP_FALLAS_REPORTAR_FALLAS],
  },
  {
    href: "https://sge.frba.utn.edu.ar/sge2/ventanilla/ventanilla.php",
    label: "Ventanilla",
    esExterna: true,
    isPublic: false,
    permisos: [],
  },
  {
    href: "https://sge.frba.utn.edu.ar/sge2/consejeros/index.php",
    label: "Consejeros",
    esExterna: true,
    isPublic: false,
    permisos: [SgeNombre.ADMIN_ACTUALIZAR_ACTA_CONSEJEROS],
  },
  {
    href: "https://sge.frba.utn.edu.ar/sge2/inscripciones_especiales/index.php",
    label: "Inscripciones especiales",
    esExterna: true,
    isPublic: false,
    permisos: [SgeNombre.ADMIN_OFERTAS_LABORALES_ABM],
  },
];

export const APP_ROUTES: AppRoute[] = [
  INICIO_ROUTE,
  LABORATORIO_ROUTE,
  LABORATORIO_ABIERTO_ROUTE,
  MATERIA_ROUTE,
  CURSOS_ROUTE,
  EQUIPOS_ROUTE,
  BIBLIOTECA_ROUTE,
  ADMIN_ROUTE,
  REPORTES_ROUTE,
  ...SGE_1_ROUTE,
];

export const USER_ROUTES = (id: string): AppRoute[] => [
  {
    href: "/perfil/" + id,
    label: "Perfil",
    isPublic: false,
    permisos: [],
  },
  {
    href: "/api/auth/signout",
    label: "Cerrar sesión",
    isPublic: false,
    permisos: [],
  },
];

export const APP_ROUTES_MAP = APP_ROUTES.reduce(
  (acc, route) => {
    acc[route.href] = route;
    return acc;
  },
  {} as Record<string, AppRoute>,
);
