import { Ubicacion } from './Ubicacion';
import { Regulation } from './Regulation';

export type Expediente = {
  id: any;
  code: string;
  organizationCode: string;
  correlativeNumber: string;
  issuer: string;
  year: number;
  regulations: Regulation[];
  solicitude: string;
  locations: Ubicacion[];
  pdfPath?: string;
}
export type { Ubicacion };
