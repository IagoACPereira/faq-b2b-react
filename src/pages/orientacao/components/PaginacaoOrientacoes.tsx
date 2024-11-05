import { useSearchParams } from "react-router-dom";
import { TipoResponseOrientacoes } from "../../../types/TipoResponseOrientacoes";
import { useState } from "react";

export default function PaginacaoOrientacoes(props: TipoResponseOrientacoes): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [limite] = useState<number>(Number(searchParams.get('limite')));

  function mudaPagina(pagina: number): void {
    setSearchParams({
      pagina: String(pagina),
      limite: String(limite)
    });
    location.reload()
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div className="mb-3 input-group w-25">
        {
          props.paginaAnterior !== ''
          ? <button className="bi bi-arrow-left-short btn btn-primary" onClick={() => mudaPagina(Number(props.paginaAnterior))} ></button>
          : <button className="bi bi-arrow-left-short btn btn-primary" disabled></button>
        }
        <div className="form-control text-center">{ props.paginaAtual } / { props.qtdPaginas }</div>
        {
          props.proximaPagina !== ''
          ? <button className="bi bi-arrow-right-short btn btn-primary" onClick={() => mudaPagina(Number(props.proximaPagina))}></button>
          : <button className="bi bi-arrow-right-short btn btn-primary" disabled></button>
        }
      </div>
    </div>
  );
}