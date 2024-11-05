import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function FiltrosOrientacoes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagina] = useState<number>(Number(searchParams.get('pagina')));
  const [limite] = useState<number>(Number(searchParams.get('limite')));

  function buscaPorPalavraChave(): void {
    const palavraChave = document.querySelector('#palavraChave') as HTMLInputElement;
    setSearchParams({
      pagina: String(pagina),
      limite: String(limite),
      palavraChave: String(palavraChave.value || ''),
    });
    location.reload();
  }

  function buscaPorData(): void {
    const filtroData = document.querySelector('#filtroData') as HTMLInputElement;
    setSearchParams({
      pagina: String(pagina),
      limite: String(limite),
      filtroData: String(filtroData.value)
    });
    location.reload();
  }

  return (
    <>
      <form onSubmit={() => buscaPorPalavraChave()} method="dialog" className="input-group mb-3">
        <label htmlFor="palavraChave" className="input-group-text">Palavra-Chave</label>
        <input type="text" className="form-control" name="palavraChave" id="palavraChave" />
        <button type="submit" className="btn btn-primary bi bi-search">
          &nbsp;
          Pesquisar
        </button>
      </form>

      <form onSubmit={() => buscaPorData()} method="dialog" className="input-group">
        <label htmlFor="filtroData" className="input-group-text">Data</label>
        <input type="date" className="form-control" name="filtroData" id="filtroData" />
        <button type="submit" className="btn btn-primary bi bi-search">
          &nbsp;
          Pesquisar
        </button>
      </form>
    </>
  )
}