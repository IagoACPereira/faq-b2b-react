import { TipoOrientadores } from "./TipoOrientadores";
import { TipoTema } from "./TipoTema";

export type TipoOrientacao = {
  id: number;
  titulo: string;
  data: string;
  hora: string;
  conteudo: string;
  orientador: TipoOrientadores;
  tema_orientacaos: Array<{
    id: number,
    tema: TipoTema,
  }>;
  deletado: boolean;
}