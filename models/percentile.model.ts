export interface PercentileInput {
  gender: string;
  birthdate: string;
  value: number;
}

export interface PercentileOutput {
  percentile: number;
  description: string;
}

export interface BMIInput {
  gender: string;
  birthdate: string;
  weight: number;
  length: number;
}

export interface BMIOutput {
  bmi: number;
  percentile: number;
  result: string;
}

// export interface OutputPercentile {
//   gender: string;
//   birthdate: Date;
//   value: number;
// }
