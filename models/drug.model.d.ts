import internal from "stream";

export type Drug = {
  id: number;
  name: string;
  conterIndications: string;
  secondaryEffects: string;
  comercialBrands: string;
  obs: string;
  presentation: string;
  createdAt: Date;
  updatedAt: Date;
  indications: Indication[];
  variables: Variable[];
  calculations: Calculation[];
};

export type Dose = {
  id: number;
  indicationId: number;
  idVia: String;
  pediatricDose: String;
  idUnityPediatricDose: String;
  adultDose: String;
  idUnityAdultDose: String;
  takesPerDay: String;
  maxDosePerDay: String;
  idUnityMaxDosePerDay: String;
  obs: String;
  createdAt: Date;
  updatedAt: Date;
};

export type Indication = {
  id: number;
  drugId: number;
  indicationText: String;
  createdAt: Date;
  updatedAt: Date;
  doses: Dose[];
};

export type Variable = {
  id: String;
  description: String;
  idUnit: String;
  type: String;
  createdAt: Date;
  updatedAt: Date;
};

export type Calculation = {
  id: number;
  drugId: number;
  type: String;
  function: String;
  resultDescription: String;
  resultIdUnit: String;
  description: String;
  createdAt: Date;
  updatedAt: Date;
};

export type CalculationResult = {
  id: number;
  description: String;
  resultDescription: String;
  resultIdUnit: String;
  result: any;
};

export interface CalculationInput {
  variable: String;
  value: any;
}
