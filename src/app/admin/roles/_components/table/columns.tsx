// import { Badge } from "@/components/ui/badge";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

type LibroData = RouterOutputs["admin"]["roles"]["getAllRoles"]["roles"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<LibroData>();

  return [
    colHelper.accessor("nombre", {
      header: "Nombre",
    }),
    colHelper.accessor("fechaCreacion", {
      header: "Fecha creación",
      cell: ({ getValue }) => {
        const id = getValue();

        return new Date(id).toLocaleDateString("es-ES");
      },
    }),
    colHelper.display({
      header: "Cantidad de usuarios",
      cell: (info) => {
        const usuarios = info.row.original.usuarios;

        return usuarios.length;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
    colHelper.display({
      header: "Cantidad de permisos",
      cell: (info) => {
        const permisos = info.row.original.rolPermiso;

        return permisos.length;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
    // colHelper.display({
    //   header: "Permisos",
    //   cell: (info) => {
    //     const rolesPermiso = info.row.original.rolPermiso;

    //     return (
    //       <div className="flex flex-row space-x-2">
    //         {rolesPermiso.map((rol) => (
    //           <Badge key={rol.permisoId} color="aqua" label={rol.permiso.nombre} />
    //         ))}
    //       </div>
    //     );
    //   },
    //   meta: {
    //     header: {
    //       hideSort: true,
    //     },
    //   },
    // }),
  ] as ColumnDef<LibroData>[];
};

export const adminRolesColumnas = [
  "Nombre",
  "Fecha creación",
  "Cantidad de usuarios",
  "Cantidad de permisos",
  // "Permisos",
];
