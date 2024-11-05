import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../config/env";
import Carregando from "../../components/Carregando";
import { PopUpErro } from "../../modules/PopUps";
import { TipoOrientacao } from "../../types/TipoOrientacao";
import { Link, useSearchParams } from "react-router-dom";
import ContainerFiltroTemas from "./components/ContainerFiltroTemas";

export default function Temas(): JSX.Element {
  const [temas, setTemas] = useState<Array<{
    id: number,
    titulo: string,
    tema_orientacaos: Array<{
      id: number,
      orientacao: TipoOrientacao,
    }>,
    deletado?: boolean,
  }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtroTema] = useState<Array<number>>(JSON.parse(String(searchParams.get('filtroTema'))));

  async function pegaTemas(): Promise<void> {
    await axios.get(`${env.urlApi}/temas?pagina=1&limite=100000`, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        const { dados } = response.data;
        setTemas(dados);
        setLoading(false);
      })
      .catch(error => {
        setMensagemErro(error.response.data.mensagem);
        setLoading(false);
        setErro(true);
      });
  }

  function filtraPorTemas(): void {
    const checkboxesChecked = document.querySelectorAll('input[name="tema"]:checked') as NodeListOf<HTMLInputElement>;
    const idsTemas: Array<number> = [];
    checkboxesChecked.forEach(check => {
      idsTemas.push(Number(check.value));
    });
    setSearchParams({
      filtroTema: JSON.stringify(idsTemas),
    });
    location.reload();
  }

  useEffect(() => {
    pegaTemas();
  }, []);

  if (loading) {
    return (
      <main>
        <Carregando />
      </main>
    );
  }

  if (erro) PopUpErro(mensagemErro);

  return (
    <main className="p-3">
      <h2>Temas</h2>

      <Link to={ '/faq-b2b/gerenciar/temas' } className="btn btn-primary bi bi-journal-bookmark mb-3">
        &nbsp;
        Gerenciar Temas
      </Link>

      <form onSubmit={() => filtraPorTemas()} style={{ display: 'grid', gridTemplateColumns: 'auto auto auto' }} method="dialog" className="card p-3 mb-3">
        { temas.map(tema => (
          <div key={ tema.id } className="mb-3">
            <input type="checkbox" name="tema" id={ 'tema' + tema.id } className="form-check-input me-2" defaultValue={ tema.id } />
            <label htmlFor={ 'tema' + tema.id }>{ tema.titulo.toUpperCase() }</label>
          </div>
        )) }

        <button style={{ gridColumnStart: '1', gridColumnEnd: '4' }} type="submit" className="btn btn-primary bi bi-search">
          &nbsp;
          Pesquisar
        </button>
      </form>

      { filtroTema.length !== 0 
        ? <ContainerFiltroTemas />
        : undefined }
    </main>
  );
}