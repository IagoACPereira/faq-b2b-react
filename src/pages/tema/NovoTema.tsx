import axios from "axios";
import { env } from "../../config/env";
import { PopUpErro, PopUpSucesso } from "../../modules/PopUps";

export default function NovoTema(): JSX.Element {
  async function enviarFormularioNovoTema() {
    const titulo = document.querySelector('#titulo') as HTMLInputElement;

    await axios.post(`${env.urlApi}/temas`, {
      titulo: titulo.value
    }, {
      headers: {
        Authorization: localStorage.getItem('authorization'),
      },
    })
      .then(response => {
        PopUpSucesso(response.data.mensagem);
      })
      .catch(error => {
        PopUpErro(error.response.data.mensagem);
      });
  }

  return (
    <main className="p-3">
      <form onSubmit={ () => enviarFormularioNovoTema() } method="dialog" className="card p-3 w-50">
        <h3 className="pb-2 border-bottom mb-3">Novo Tema</h3>

        <div className="mb-3">
          <label htmlFor="titulo">Título <span className="text-danger">*</span></label>
          <input type="text" name="titulo" id="titulo" className="form-control" />
        </div>

        <button type="submit" className="btn btn-primary bi bi-save">
          &nbsp;
          Gravar
        </button>
      </form>
    </main>
  );
}