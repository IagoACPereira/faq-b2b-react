export default function EtiquetaTema(props: { tituloTema: string }): JSX.Element {
  return (
    <div className="border border-primary rounded p-1 text-center text-primary m-1">
      { props.tituloTema.toUpperCase() }
    </div>
  );
}