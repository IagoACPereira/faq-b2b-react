import { Link } from "react-router-dom";
import { PopUpErro } from "../../modules/PopUps";
import Carregando from "../../components/Carregando";
import { useEffect, useState } from "react";
import { TipoOrientadores } from "../../types/TipoOrientadores";
import axios from "axios";
import { env } from "../../config/env";

export default function Orientadores(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string>('');
  const [orientadores, setOrientadores] = useState<Array<TipoOrientadores>>([]);

  async function pegaOrientadores(): Promise<void> {
    await axios.get(`${env.urlApi}/orientadores?pagina=1&limite=100000`, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        setOrientadores(response.data.dados);
        setErro(false);
        setLoading(true);
      })
      .catch(error => {
        setMensagemErro(error.response.data.mensagem);
        setLoading(false);
        setErro(true);
      });
  }

  useEffect(() => {
    pegaOrientadores();    
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
      <h2>Orientadores</h2>

      <Link to={ '' } className="btn btn-primary bi bi-plus-circle mb-3">Adicionar Orientador</Link>
    </main>
  );
}