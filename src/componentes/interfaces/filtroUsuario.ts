import { FiltroDispositivo } from "./filtroDispositivo";
export interface FiltroUsuario {
    id: string;
    nome: string;
    email: string;
    fone: string;
    senha: string;
    dispositivos: Array<FiltroDispositivo>
  }