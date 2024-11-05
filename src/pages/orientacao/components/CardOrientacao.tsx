import axios from "axios";
import { TipoOrientacao } from "../../../types/TipoOrientacao";
import { env } from "../../../config/env";
import { useEffect, useState } from "react";
import { PopUpErro } from "../../../modules/PopUps";
import EtiquetaTema from "./EtiquetaTema";
import { Link } from "react-router-dom";

export default function CardOrientacao(props: TipoOrientacao) {
  const [viewsOrientacao, setViewOrientacao] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string>('');

  async function pegaQtdVizualizacaoOrientacao(id: number): Promise<void> {
    await axios.get(`${env.urlApi}/orientacoes/qtd/visualizacao/${id}`, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        setErro(false);
        setLoading(false);
        setViewOrientacao(response.data)
      })
      .catch(error => {
        console.log(`Erro ao pegar número de vizualização das orientações: ${error.response.data.mensagem}`);
        setLoading(false);
        setErro(true);
        setMensagemErro('Erro ao pegar número de vizualização das orientações')
      });
  }

  useEffect(() => {
    pegaQtdVizualizacaoOrientacao(props.id);
  }, [props.id]);

  if (erro) PopUpErro(mensagemErro);

  return (
    <div className="card m-1">
      <div className="card-header">
        <h5 style={{ textTransform: 'capitalize' }} className="m-0">{ props.titulo }</h5>
      </div>
      <div className="card-body">
        <p className="bi bi-eye mb-2">
          &nbsp;
          <strong>{ loading ? 'Carregando...' : viewsOrientacao }</strong>
        </p>
        <p className="text-secondary bi bi-calendar-date mb-2">
          &nbsp;
          { props.data.split('-').reverse().join('/') } { props.hora }
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto' }}>
          { props.tema_orientacaos.map(to => (
            to.tema.deletado ? undefined :
              <EtiquetaTema key={ to.tema.id } tituloTema={ to.tema.titulo } />
          )) }
        </div>
        <p className="card-text mb-2">{ props.conteudo.length >= 300 ? props.conteudo.slice(0, 300) : props.conteudo }</p>
        <Link to={ '/faq-b2b/orientacao?idOrientacao=' + props.id } className="btn btn-primary">Acessar Orientação</Link>
      </div>
    </div>
  );
}