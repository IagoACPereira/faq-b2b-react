import { TipoTema } from "./TipoTema";

export type TipoResponseTema = {
  limiteItens?: number;
  paginaAnterior?: number | string;
  paginaAtual?: number;
  proximaPagina?: number | string;
  qtdItens?: number;
  qtdPaginas?: number;
  temas?: Array<TipoTema>;
};