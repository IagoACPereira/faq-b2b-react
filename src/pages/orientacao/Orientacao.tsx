/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { TipoOrientacao } from "../../types/TipoOrientacao";
import Carregando from "../../components/Carregando";
import { PopUpErro, PopUpSucesso } from "../../modules/PopUps";
import axios from "axios";
import { env } from "../../config/env";
import { Link, useSearchParams } from "react-router-dom";
import EtiquetaTema from "./components/EtiquetaTema";
import redirecionaParaOrientacoes from "../../modules/redirecionaParaOrientacoes";

export default function Orientacao(): JSX.Element {
  const [orientacao, setOrientacao] = useState<TipoOrientacao>({
    id: 0,
    titulo: '',
    data: '',
    hora: '',
    tema_orientacaos: [],
    orientador: {
      id: 0,
      nome: '',
      email: '',
      deletado: false,
    },
    conteudo: '',
    deletado: false,
  });
  const [qtdVisualizacao, setQtdVisualizacao] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string>('');
  const [searchParams] = useSearchParams();
  const [idOrientacao] = useState<number>(Number(searchParams.get('idOrientacao')));

  async function pegaOrientacao(): Promise<void> {
    await axios.get(`${env.urlApi}/orientacoes/${idOrientacao}`, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        setOrientacao(response.data);
        setErro(false);
      })
      .catch(error => {
        setMensagemErro(error.response.data.mensagem);
        setLoading(false);
        setErro(true);
      });
  }

  async function pegaQtdVizualizacoes(): Promise<void> {
    await axios.get(`${env.urlApi}/orientacoes/qtd/visualizacao/${idOrientacao}`, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        setQtdVisualizacao(response.data);
        setErro(false);
        setLoading(false);
      })
      .catch(error => {
        setMensagemErro(error.response.data.mensagem);
        setLoading(false);
        setErro(true);
      });
  }

  async function deletaOrientacao(): Promise<void> {
    await axios.delete(`${env.urlApi}/orientacoes/${idOrientacao}`, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        PopUpSucesso(response.data.mensagem);
        redirecionaParaOrientacoes();
      })
      .catch(error => {
        setMensagemErro(error.response.data.mensagem);
        setLoading(false);
        setErro(true);
      });
  }

  useEffect(() => {
    pegaOrientacao();
  }, []);

  useEffect(() => {
    pegaQtdVizualizacoes();
  }, [orientacao]);

  if (loading) {
    return (
      <main>
        <Carregando />
      </main>
    );
  }

  if (erro) PopUpErro(mensagemErro);

  return (
    <main className="m-3 card p-3 w-50">
      <h5 style={{ textTransform: 'capitalize' }}>{ orientacao.titulo }</h5>

      <p className="bi bi-eye mb-2">
        &nbsp;
        <strong>{ qtdVisualizacao ? qtdVisualizacao : 0 }</strong>
      </p>

      <p className="text-secondary bi bi-calendar-date mb-2">
        &nbsp;
        { orientacao.data } { orientacao.hora }
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto' }} className="mb-2">
        { orientacao.tema_orientacaos.map(to => (
          to.tema.deletado ? undefined :
            <EtiquetaTema key={ to.tema.id } tituloTema={ to.tema.titulo } />
        )) }
      </div>

      <div className="card p-3 mb-2">{ orientacao.conteudo }</div>

      <Link to={ '/faq-b2b/atualiza/orientacao?idOrientacao=' + idOrientacao } type="button" className="btn btn-primary bi bi-pencil-square mb-2">
        &nbsp;
        Atualizar
      </Link>

      <button onClick={() => deletaOrientacao()} type="button" className="btn btn-danger bi bi-trash">
        &nbsp;
        Deletar
      </button>
    </main>
  );
}