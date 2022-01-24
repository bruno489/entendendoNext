import {InfosMod} from './infosMod'
import {Itens} from './itens'

export interface InfosDisp {
    _id: string;
    idModelo: string;
    nome: string;
    itens:Array<Itens>;
    modelo: InfosMod;
    nrserie: string;
    senha: string;
    ativo: boolean;
  }