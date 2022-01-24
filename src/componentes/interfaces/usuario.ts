import { InfosDisp } from "./infosDisp";
export interface Usuario {
    id: string;
    nome: string;
    email: string;
    fone: string;
    senha: string;
    dispositivos: Array<InfosDisp>
  }