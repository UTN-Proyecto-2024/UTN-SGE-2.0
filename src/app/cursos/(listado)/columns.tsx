/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DatoUsuarioReserva } from "@/app/_components/datos-usuario";
import { CursoTurno } from "@/app/_components/turno-text";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Root, Trigger, Portal, Content, Arrow } from "@radix-ui/react-popover";

type CursosData = RouterOutputs["cursos"]["getAll"]["cursos"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<CursosData>();

  return [
    colHelper.accessor("anioDeCarrera", {
      header: "Año",
    }),
    colHelper.accessor("materia.nombre", {
      header: "Materia",
    }),
    colHelper.accessor("sede.nombre", {
      header: "Sede",
    }),
    colHelper.accessor("ac", {
      header: "Duración",
      cell: (info) => {
        const duracion = info.row.original.ac;

        if (duracion === "A") return "Anual";
        if (duracion === "C") return "Cuatrimestral";
        return "-";
      },
    }),
    colHelper.accessor("turno", {
      header: "Turno",
      cell: (info) => <CursoTurno turno={info.row.original.turno} />,
    }),
    colHelper.accessor("division.nombre", {
      header: "División",
    }),
    colHelper.display({
      header: "Horario",
      cell: ({ row }) => <Schedule {...row.original}></Schedule>,
    }),
    colHelper.display({
      header: "Profesor",
      cell: (info) => <DatoUsuarioReserva usuario={info.row.original.profesor} profesor={true} />,
    }),
    colHelper.display({
      header: "Ayudante/s",
      cell: (info) => {
        const ayudantes = info.row.original.ayudantes;

        if (!ayudantes.length) return <span className="hidden">Sin ayudantes</span>;

        return (
          <div className="flex -space-x-2 overflow-hidden">
            {ayudantes.map((ayudante) => (
              <DatoUsuarioReserva usuario={ayudante.usuario} profesor={false} key={ayudante.userId} />
            ))}
          </div>
        );
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
  ] as ColumnDef<CursosData>[];
};

export const getColumnsNames = () => {
  return ["Año", "Materia", "Sede", "Duración", "Turno", "Division", "Profesor", "Ayudante/s"];
};

const dayMapper = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
};

type dayKey = keyof typeof dayMapper;
const horas = [0, 1, 2, 3, 4, 5, 6];

const Schedule = (curso: CursosData) => {
  const inicio1 = parseInt(curso.horaInicio1 ?? "-1");
  const inicio2 = parseInt(curso.horaInicio2 ?? "-1");
  const fin1 = inicio1 >= 0 ? inicio1 + parseInt(curso.duracion1 ?? "0") - 1 : 7;
  const fin2 = inicio2 >= 0 ? inicio2 + parseInt(curso.duracion2 ?? "0") - 1 : 7;
  return (
    <Root>
      <Trigger className="inline-flex w-full gap-x-1.5 rounded-md text-left text-sm text-gray-900">
        {`${dayMapper[curso.dia1 as dayKey].slice(0, 3).toUpperCase()} [${inicio1} a ${fin1}]`}
        <br />
        {curso.dia2 && `${dayMapper[curso.dia2 as dayKey].slice(0, 3).toUpperCase()} [${inicio2} a ${fin2}]`}
      </Trigger>

      <Portal>
        <Content className="z-10 w-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-2">
            {Object.entries(dayMapper).map(([key, value]) => (
              <div key={value} className="flex justify-between px-4 py-2 text-sm text-gray-700 hover:bg-slate-100">
                <div className="mr-auto pr-4">{value}</div>
                {horas.map((hora) => (
                  <div
                    key={hora}
                    className={`flex h-5 w-5 justify-center rounded-full ${
                      (key === curso.dia1 && inicio1 <= hora && fin1 >= hora) ||
                      (key === curso.dia2 && inicio2 <= hora && fin2 >= hora)
                        ? "bg-primary"
                        : "bg-slate-300"
                    }`}
                  >
                    {hora}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <Arrow className="fill-current text-white" />
        </Content>
      </Portal>
    </Root>
  );
};
