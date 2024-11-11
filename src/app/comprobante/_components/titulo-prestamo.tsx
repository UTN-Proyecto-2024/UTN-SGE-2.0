export const TituloPrestamo = ({
  esLibro,
  reservaId,
  inventarioId,
}: {
  esLibro: boolean;
  reservaId: number;
  inventarioId: string;
}) => {
  if (esLibro) {
    return (
      <h3 className="text-center text-2xl font-bold">
        Préstamo de Libro #{reservaId} - {inventarioId}
      </h3>
    );
  }

  return (
    <h3 className="text-center text-2xl font-bold">
      Préstamo de Equipo #{reservaId} - {inventarioId}
    </h3>
  );
};
