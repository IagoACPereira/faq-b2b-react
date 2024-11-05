/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { TipoOrientacao } from "../../types/TipoOrientacao";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { env } from "../../config/env";
import Carregando from "../../components/Carregando";
import { PopUpErro, PopUpSucesso } from "../../modules/PopUps";
import { TipoTema } from "../../types/TipoTema";
import { TipoOrientadores } from "../../types/TipoOrientadores";

export default function AtualizaOrientacao(): JSX.Element {
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
  const [temas, setTemas] = useState<Array<TipoTema>>([])
  const [orientadores, setOrientadores] = useState<Array<TipoOrientadores>>([]);
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

  async function deletaAssociacaoTemaOrientacao(idAssociacao: number) {
    await axios.delete(`${env.urlApi}/temas-orientacoes/${idAssociacao}`, {
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

  async function enviaFormularioAlteracao() {
    const checkBoxesTemas = document.querySelectorAll('input[name="tema"]:checked') as NodeListOf<HTMLInputElement>;
    const titulo = document.querySelector('#titulo') as HTMLInputElement;
    const idOrientador = document.querySelector('#idOrientador') as HTMLSelectElement;
    const conteudo = document.querySelector('#conteudo') as HTMLTextAreaElement;
    const date = new Date();
    const data = [
      date.getFullYear(),
      String(date.getMonth() + 1).length < 2 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
      String(date.getDate()).length < 2 ? '0' + date.getDate() : date.getDate(),
    ].join('-');
    const hora = [
      String(date.getHours()).length < 2 ? '0' + date.getHours() : date.getHours(),
      String(date.getMinutes()).length < 2 ? '0' + date.getMinutes() : date.getMinutes(),
    ].join(':');    
    
    await axios.put(`${env.urlApi}/orientacoes/${idOrientacao}`, {
      titulo: String(titulo.value),
      data: String(data),
      hora: String(hora),
      idOrientador: Number(idOrientador.value),
      conteudo: String(conteudo.value),
    }, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        setErro(false);
        setLoading(false);
        orientacao.tema_orientacaos.map(to => {
          deletaAssociacaoTemaOrientacao(to.id);
        });
        setTimeout(() => {
          checkBoxesTemas.forEach(check => {
            enviaFormularioAssociacaoTemaOrientacao(Number(check.value), idOrientacao)
          });

          PopUpSucesso(response.data.mensagem);
        }, 1000);
      })
      .catch(error => {
        setMensagemErro(error.response.data.mensagem);
        setLoading(false);
        setErro(true);
      });
  }

  useEffect(() => {
    pegaOrientacao();
    console.log({orientacao});
    
  }, []);

  useEffect(() => {
    pegaTemas();
    console.log({temas});
    
  }, [orientacao]);

  useEffect(() => {
    pegaOrientadores();
    console.log({orientadores});
    
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
      <form onSubmit={() => enviaFormularioAlteracao()} method="dialog" className="m-3 card w-50 p-3">
        <h2 style={{ textTransform: 'capitalize' }} className="border-bottom pb-2 mb-3">{ orientacao.titulo }</h2>

        <div className="card p-3 mb-3">
          <h5 className="border-bottom pb-2 mb-2">Tema(s) <span className="text-danger">*</span></h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto' }}>
            { temas.map(tema => (
              tema.deletado ? undefined :
                <div key={ tema.id }>
                  <input type="checkbox" name="tema" id={ 'tema' + tema.id } value={ tema.id } className="form-check-input me-2" defaultChecked={ JSON.stringify(orientacao.tema_orientacaos).includes(tema.titulo) ? true : false } />

                  <label htmlFor={ 'tema' + tema.id }>{ tema.titulo.toUpperCase() }</label>
                </div>
            )) }
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="titulo">Título <span className="text-danger">*</span></label>
          <input type="text" name="titulo" id="titulo" className="form-control" defaultValue={ orientacao.titulo } />
        </div>

        <div className="mb-3">
          <label htmlFor="idOrientador">Orientador <span className="text-danger">*</span></label>
          <select defaultValue={ orientacao.orientador.id } className="form-select" name="idOrientador" id="idOrientador">
            <option value="" disabled>--Selecione--</option>
            { orientadores.map(orientador => (
              orientador.deletado ? undefined :
                <option key={ orientador.id } value={ orientador.id }>{ orientador.nome } - { orientador.email }</option>
            )) }
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="conteudo">Conteúdo <span className="text-danger">*</span></label>
          <textarea className="form-control" rows={ 10 } name="conteudo" id="conteudo" defaultValue={ orientacao.conteudo }></textarea>
        </div>

        <button type="submit" className="btn btn-primary bi bi-save">
          &nbsp;
          Gravar
        </button>
      </form>
    </main>
  );
}