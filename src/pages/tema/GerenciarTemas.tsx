import { useEffect, useState } from "react";
import Carregando from "../../components/Carregando";
import { PopUpErro, PopUpSucesso } from "../../modules/PopUps";
import axios from "axios";
import { env } from "../../config/env";
import { TipoTema } from "../../types/TipoTema";
import { Link } from "react-router-dom";
import redirecionaParaGerenciarTemas from "../../modules/redirecionaParaGerenciarTemas";

export default function GerenciarTemas(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string>('');
  const [temas, setTemas] = useState<Array<TipoTema>>([]);

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

  async function deletaTema(id: number): Promise<void> {
    await axios.delete(`${env.urlApi}/temas/${id}`, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        PopUpSucesso(response.data.mensagem);
        redirecionaParaGerenciarTemas();
      })
      .catch(error => {
        setMensagemErro(error.response.data.mensagem);
        setLoading(false);
        setErro(true);
      });
  }

  useEffect(() => {
    pegaTemas();    
  }, [])

  if (loading) {
    return (
      <main>
        <Carregando />
      </main>
    );
  }

  if (erro) PopUpErro(mensagemErro)

  return (
    <main className="p-3">
      <h3>Gerenciar Temas</h3>

      <Link to={ '/faq-b2b/novo/tema' } className="btn btn-primary bi bi-plus-circle mb-3">
        &nbsp;
        Novo Tema
      </Link>

      { temas.map(tema => (
          tema.deletado
          ? undefined
          : <div className="border rounded p-3 mb-3" key={ tema.id } >
              <h3 style={{ textTransform: 'capitalize' }} className="me-3">{ tema.titulo }</h3>
              
              <Link to={ '/faq-b2b/atualiza/tema?idTema=' + tema.id } className="btn btn-primary bi bi-pencil-square me-3 w-25">
                &nbsp;
                Atualizar
              </Link>

              <button onClick={ () => deletaTema(tema.id) } type="button" className="btn btn-danger bi bi-trash w-25">
                &nbsp;
                Deletar
              </button>
            </div>
      )) }
    </main>
  );
}