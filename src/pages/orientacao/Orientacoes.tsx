import { useEffect, useState } from "react";
import AccordionOpcoesFiltros from "./components/AccordionOpcoesFiltros";
import CardOrientacao from "./components/CardOrientacao";
import { PopUpErro } from "../../modules/PopUps";
import Carregando from "../../components/Carregando";
import axios from "axios";
import { env } from "../../config/env";
import { TipoOrientacao } from "../../types/TipoOrientacao";
import { TipoResponseOrientacoes } from "../../types/TipoResponseOrientacoes";
import PaginacaoOrientacoes from "./components/PaginacaoOrientacoes";

export default function Orientacoes(): JSX.Element {
  const [response, setResponse] = useState<TipoResponseOrientacoes>({});
  const [orientacoes, setOrientacoes] = useState<Array<TipoOrientacao>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string>('');

  async function pegaOrientacoes(): Promise<void> {
    await axios.get(`${env.urlApi}/orientacoes${location.search}`, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        setLoading(false);
        setErro(false);
        setOrientacoes(response.data.dados); 
        setResponse(response.data);
      })
      .catch(error => {
        setLoading(false);
        setMensagemErro(error.response.data.mensagem);
        setErro(true)
      });
  }

  useEffect(() => {
    pegaOrientacoes();
  }, [])

  if (loading) {
    return (
      <main>
        <Carregando />
      </main>
    )
  }

  if (erro) PopUpErro(mensagemErro)

  return (
    <main className="m-3">
      <h2>Orientações</h2>

      <AccordionOpcoesFiltros />

      <PaginacaoOrientacoes 
        paginaAtual={ response.paginaAtual } 
        qtdPaginas={ response.qtdPaginas }
        proximaPagina={ response.proximaPagina }
        paginaAnterior={ response.paginaAnterior }
        limiteItens={ response.limiteItens }
      />

      <p className="mb-3">Foram encontrados <span className="text-primary">{ response.qtdItens || 0 }</span> resultados.</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto auto auto',
      }} className="container-orientacoes">
        
        { orientacoes.map(orientacao => (
            !orientacao.deletado ?
            <CardOrientacao 
              key={ orientacao.id } 
              id={ orientacao.id } 
              titulo={ orientacao.titulo } 
              data={ orientacao.data }
              hora={ orientacao.hora }
              conteudo={ orientacao.conteudo }
              tema_orientacaos={ orientacao.tema_orientacaos }
              deletado={ orientacao.deletado }
              orientador={ orientacao.orientador }
            /> : undefined
          )) }
      </div>
    </main>
  )
}