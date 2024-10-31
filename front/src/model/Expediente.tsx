import { Ubicacion } from './Ubicacion';
import { Regulation } from './Regulation';

export type Expediente = {
  id: number;
  codigo: string;
  numeroOrden: string;
  numeroExpediente: string;
  emisor: string;
  ano: number;
  reglamentacion: Regulation[];
  pedido: string;
  ubicaciones: Ubicacion[];
  pdfPath?: string;
}
export type { Ubicacion };
