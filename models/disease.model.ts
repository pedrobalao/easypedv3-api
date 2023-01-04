export interface DiseaseLight {
  id: number;
  description: string;
  indication: string;
}

export interface Condition {
  id: number;
  condition: string;
  firstline: string;
  secondline: string;
  thirdline: string;
}

export interface Treatment {
  conditions: Condition[];
  initial_evaluation: string;
}

export interface Disease extends DiseaseLight {
  author: string;
  followup: string;
  example: string;
  bibliography: string;
  observation: string;
  treatment_description: string;
  status: string;
  treatment: Treatment;
  treatmentstr?: string;
  general_measures: string;
}
