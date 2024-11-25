import { env } from "@/env";

const urlSGE = env.NEXT_PUBLIC_RUTA_ACTUAL ?? "";

export const DatosUniversidad = () => {
  return (
    <div className="flex h-full flex-col justify-between text-left">
      <div className="text-left text-xs">
        <p>Depto. Electrónica - UTN</p>
        <p>Facultad Regional Buenos Aires</p>
        <p>{urlSGE}</p>
      </div>
    </div>
  );
};
