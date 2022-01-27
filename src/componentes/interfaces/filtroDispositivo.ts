import {FiltroModelo} from './filtroModelo'
import {FiltroItens} from './filtroItens'

export interface FiltroDispositivo {
    _id: string;
    idModelo: string;
    nome: string;
    itens:Array<FiltroItens>;
    modelo: FiltroModelo;
    nrserie?: string;
    senha?: string;
    ativo: boolean;
  }