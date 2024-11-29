import { Ubicacion } from './Ubicacion';
import { Regulation } from './Regulation';

export type Expediente = {
  id: any;
  organizationCode: string;
  correlativeNumber: string;
  issuer: string;
  year: string;
  regulations: Regulation[];
  solicitude: string;
  locations: Ubicacion[];
  pdfPath?: string;
}
export type { Ubicacion };
export type { Regulation };
