export interface EmergencyDrugs {
  id: number;
  edgroup: string;
  edsubgroup: string;
  edsubgroup_title: string;
  drug: string;
  concentration: string;
  via: string;
  dose: string;
  formula: string;
  unity: string;
  max: number;
  obs: string;
}

export interface EmergencyDrugsCalculationResult extends EmergencyDrugs {
  result: string;
}
