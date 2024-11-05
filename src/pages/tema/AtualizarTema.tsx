/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Carregando from "../../components/Carregando";
import { PopUpErro, PopUpSucesso } from "../../modules/PopUps";
import axios from "axios";
import { env } from "../../config/env";
import { TipoTema } from "../../types/TipoTema";
import { useSearchParams } from "react-router-dom";

export default function AtualizarTema(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string>('');
  const [tema, setTema] = useState<TipoTema>({
    id: 0,
    titulo: '',
    deletado: true,
  });
  const [searchParams] = useSearchParams();
  const [idTema] = useState<number>(Number(searchParams.get('idTema')));

  async function pegaDadosTema(): Promise<void> {
    await axios.get(`${env.urlApi}/temas/${idTema}`, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        setTema(response.data);
        setErro(false);
        setLoading(false);
      })
      .catch(error => {
        setMensagemErro(error.response.data.mensagem);
        setLoading(false);
        setErro(true);
      });
  }

  async function atualizaTema(): Promise<void> {
    const titulo = document.querySelector('#titulo') as HTMLInputElement;
    await axios.put(`${env.urlApi}/temas/${idTema}`,{
      titulo: titulo.value,
    } , {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        PopUpSucesso(response.data.mensagem)
      })
      .catch(error => {
        setMensagemErro(error.response.data.mensagem);
        setLoading(false);
        setErro(true);
      });
  }

  useEffect(() => {
    pegaDadosTema();
  },[]);

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
      <form onSubmit={ () => atualizaTema() } method="dialog" className="card p-3 w-50">
        <h3 className="pb-2 border-bottom mb-3">Novo Tema</h3>

        <div className="mb-3">
          <label htmlFor="titulo">Título <span className="text-danger">*</span></label>
          <input type="text" name="titulo" id="titulo" className="form-control" defaultValue={ tema.titulo } />
        </div>

        <button type="submit" className="btn btn-primary bi bi-save">
          &nbsp;
          Gravar
        </button>
      </form>
    </main>
  );
}