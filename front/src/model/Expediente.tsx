
export type Expediente = {
  id: number;
  issuer: string;
  organizationCode: string;
  correlativeNumber: string;
  solicitude: string;
  year: string;
  status: string;
  pdfPath?: string;
  regulations: Regulation[];
  locations: Location[];
}

export type Location = {
  id: number;
  origin: string;
  destiny: string;
  place: string;
  expedient: Expediente;
}

export type Regulation = {
  id: number;
  description: string;
  expedient: Expediente;
}


