export interface MedicalCalculation {
  id: number;
  description: string;
  formula: string;
  resultUnitId: string;
  observation: string;
  calculationGroupId: number;
  resultType: string;
  precision: number | null;
  variables: MedicalCalculationVariable[];
}

export interface MedicalCalculationVariable {
  id: string;
  variableId: string;
  description: string;
  idUnit: string;
  type: string;
  values: string[];
  optional: boolean;
}
