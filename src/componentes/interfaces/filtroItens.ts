export interface FiltroItens{
    index?:number;
    _id?:string;
    nome:string;
    sensor:boolean;
    ligado:boolean;
    ativo:boolean;
    leituras?:Array<any>;
}