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
      id: "materia",
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
      cell: (info) => <DatoUsuarioReserva usuario={info.row.original.profesor} />,
    }),
    colHelper.display({
      header: "Ayudante/s",
      cell: (info) => {
        const ayudantes = info.row.original.ayudantes;

        if (!ayudantes.length) return <span className="hidden">Sin ayudantes</span>;

        return (
          <div className="flex -space-x-2 overflow-hidden">
            {ayudantes.map((ayudante) => (
              <DatoUsuarioReserva usuario={ayudante.usuario} mostrarNombre={false} key={ayudante.userId} />
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

const hourMapper = {
  MANANA: {
    0: "7:45",
    1: "8:30",
    2: "9:15",
    3: "10:15",
    4: "11:00",
    5: "11:45",
    6: "12:30",
    7: "13:15",
  },
  TARDE: {
    0: "13:30",
    1: "14:15",
    2: "15:00",
    3: "16:00",
    4: "16:45",
    5: "17:30",
    6: "18:15",
    7: "19:00",
  },
  NOCHE: {
    0: "18:15",
    1: "19:00",
    2: "19:45",
    3: "20:45",
    4: "21:30",
    5: "22:15",
    6: "23:00",
    7: "23:45",
  },
};

type dayKey = keyof typeof dayMapper;
type turnoKey = keyof typeof hourMapper;

const horas = [0, 1, 2, 3, 4, 5, 6];

const Schedule = (curso: CursosData) => {
  const inicio1 = parseInt(curso.horaInicio1 ?? "-1");
  const inicio2 = parseInt(curso.horaInicio2 ?? "-1");
  const fin1 = inicio1 >= 0 ? inicio1 + parseInt(curso.duracion1 ?? "0") - 1 : 7;
  const fin2 = inicio2 >= 0 ? inicio2 + parseInt(curso.duracion2 ?? "0") - 1 : 7;

  const turno = hourMapper[curso.turno as turnoKey];
  type hourKey = keyof typeof turno;

  return (
    <Root>
      <Trigger className="inline-flex w-full gap-x-1.5 rounded-md text-left text-sm text-gray-900">
        {`${dayMapper[curso.dia1 as dayKey].slice(0, 3).toUpperCase()} [${turno[inicio1 as hourKey]}-${turno[(fin1 + 1) as hourKey]}]`}
        <br />
        {curso.dia2 &&
          curso.dia1 !== curso.dia2 &&
          `${dayMapper[curso.dia2 as dayKey].slice(0, 3).toUpperCase()} [${turno[inicio2 as hourKey]}-${turno[(fin2 + 1) as hourKey]}]`}
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
