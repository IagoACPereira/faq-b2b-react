import { useEffect, useState } from "react";
import { TipoTema } from "../../types/TipoTema";
import axios from "axios";
import { env } from "../../config/env";
import Carregando from "../../components/Carregando";
import { PopUpErro, PopUpSucesso } from "../../modules/PopUps";
import { TipoOrientadores } from "../../types/TipoOrientadores";

export default function NovaOrientacao(): JSX.Element {
  const [temas, setTemas] = useState<Array<TipoTema>>([])
  const [orientadores, setOrientadores] = useState<Array<TipoOrientadores>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string>('');

  async function pegaTemas() {
    await axios.get(`${env.urlApi}/temas?pagina=1&limite=1000`, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        setTemas(response.data.dados);        
        setErro(false);
      })
      .catch(error => {
        setMensagemErro(error.response.data.mensagem);
        setLoading(false);
        setErro(true);
      });
  }

  async function pegaOrientadores() {
    await axios.get(`${env.urlApi}/orientadores?pagina=1&limite=1000`, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        setOrientadores(response.data.dados);
        setErro(false);
        setLoading(false);
      })
      .catch(error => {
        setMensagemErro(error.response.data.mensagem);
        setLoading(false);
        setErro(true);
      });
  }

  async function enviaFormularioAssociacaoTemaOrientacao(idTema: number, idOrientacao: number) {
    await axios.post(`${env.urlApi}/temas-orientacoes`, {
      idTema,
      idOrientacao,
    }, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        setLoading(false);
        setErro(false);
        console.log(response.data.mensagem);
      })
      .catch(error => {
        setMensagemErro(error.response.data.mensagem);
        setLoading(false);
        setErro(true);
      });
  }

  async function enviaFormularioNovaOrientacao() {
    const checkBoxesTemas = document.querySelectorAll('input[name="tema"]:checked') as NodeListOf<HTMLInputElement>;
    const titulo = document.querySelector('#titulo') as HTMLInputElement;
    const idOrientador = document.querySelector('#idOrientador') as HTMLSelectElement;
    const conteudo = document.querySelector('#conteudo') as HTMLTextAreaElement;
    const date = new Date();
    const data = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    ].join('-');
    const hora = [
      date.getHours(),
      date.getMinutes(),
    ].join(':');
    let idNovaOrietacao: number = 0; 

    await axios.post(`${env.urlApi}/orientacoes`, {
      titulo: titulo.value,
      data,
      hora,
      conteudo: conteudo.value,
      idOrientador: Number(idOrientador.value),
    }, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        setLoading(false);
        setErro(false);
        idNovaOrietacao = response.data.dados.id;
        checkBoxesTemas.forEach(tema => {
          enviaFormularioAssociacaoTemaOrientacao(Number(tema.value), Number(idNovaOrietacao));
        });

        PopUpSucesso(response.data.mensagem);
      })
      .catch(error => {
        setMensagemErro(error.response.data.mensagem);
        setLoading(false);
        setErro(true);
      });
  }

  useEffect(() => {
    pegaTemas();
  }, []);

  useEffect(() => {
    pegaOrientadores();
  }, [temas]);

  if (loading) {
    return (
      <main>
        <Carregando />
      </main>
    );
  }

  if (erro) PopUpErro(mensagemErro);

  return (
    <main>
      <form onSubmit={() => enviaFormularioNovaOrientacao()} method="dialog" className="m-3 card w-50 p-3">
        <h2 className="border-bottom pb-2 mb-3">Nova Orientação</h2>

        <div className="card p-3 mb-3">
          <h5 className="border-bottom pb-2 mb-2">Tema(s) <span className="text-danger">*</span></h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto' }}>
            { temas.map(tema => (
              tema.deletado ? undefined :
                <div key={ tema.id }>
                  <input type="checkbox" name="tema" id={ 'tema' + tema.id } value={ tema.id } className="form-check-input me-2" />
                  <label htmlFor={ 'tema' + tema.id }>{ tema.titulo.toUpperCase() }</label>
                </div>
            )) }
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="titulo">Título <span className="text-danger">*</span></label>
          <input type="text" name="titulo" id="titulo" className="form-control" />
        </div>

        <div className="mb-3">
          <label htmlFor="idOrientador">Orientador <span className="text-danger">*</span></label>
          <select defaultValue={''} className="form-select" name="idOrientador" id="idOrientador">
            <option value="" disabled>--Selecione--</option>
            { orientadores.map(orientador => (
              orientador.deletado ? undefined :
                <option key={ orientador.id } value={ orientador.id }>{ orientador.nome } - { orientador.email }</option>
            )) }
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="conteudo">Conteúdo <span className="text-danger">*</span></label>
          <textarea className="form-control" rows={ 10 } name="conteudo" id="conteudo"></textarea>
        </div>

        <button type="submit" className="btn btn-primary bi bi-save">
          &nbsp;
          Gravar
        </button>
      </form>
    </main>
  );
}