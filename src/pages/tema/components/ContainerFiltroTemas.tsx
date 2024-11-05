/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Carregando from "../../../components/Carregando";
import { PopUpErro } from "../../../modules/PopUps";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { env } from "../../../config/env";
import { TipoOrientacao } from "../../../types/TipoOrientacao";
import CardOrientacao from "../../orientacao/components/CardOrientacao";

export default function ContainerFiltroTemas(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string>('');
  const [searchParams] = useSearchParams();
  const [filtroTema] = useState<string>(String(searchParams.get('filtroTema')));
  const [temasFiltrados, setTemasFiltrados] = useState<Array<{
    id: number;
    titulo: string;
    deletado: boolean;
    tema_orientacaos: Array<{
      id: number;
      orientacao: TipoOrientacao;
    }>
  }>>([]);

  async function pegaTemasFiltrados(): Promise<void> {
    await axios.get(`${env.urlApi}/temas/arr-ids/${filtroTema}`, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        setTemasFiltrados(response.data);
        setErro(false);
        setLoading(false);
      })
      .catch(error => {
        setMensagemErro(error.response.data.mensagem);
        setLoading(false);
        setErro(true);     
      });
  }

  useEffect(() => {
    pegaTemasFiltrados();
  }, []);

  if (loading) {
    return (
      <div>
        <Carregando />
      </div>
    )
  }

  if (erro) PopUpErro(mensagemErro);

  return (
    <div>
      { temasFiltrados.map(tema => (
        tema.deletado
        ? undefined
        : <div key={ tema.id } className="card p-3 mb-3" style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto auto'
        }}>
            <h3 
              style={{ 
                textTransform: 'capitalize',
                gridColumnStart: 1,
                gridColumnEnd: 4,
              }} 
              className="border-bottom pb-2"
            >{ tema.titulo }</h3>

            { tema.tema_orientacaos.map(to => (
              <CardOrientacao
                key={ to.id }
                id={ to.orientacao.id }
                conteudo={ to.orientacao.conteudo }
                titulo={ to.orientacao.titulo }
                data={ to.orientacao.data }
                deletado={ to.orientacao.deletado }
                hora={ to.orientacao.hora }
                orientador={ to.orientacao.orientador }
                tema_orientacaos={[]}
              />
            )) }
          </div>
      )) }
    </div>
  );
}