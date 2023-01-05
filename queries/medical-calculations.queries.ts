export const MedicalCalculationsQueries = {
  List: `
        select id, description, ResultUnitId, Formula, Observation, ResultType, \`Precision\`  from medicalcalculation m order by description
          `,
  Read: `
        select id, description, ResultUnitId, Formula, Observation, ResultType, \`Precision\`  from medicalcalculation m where id = ?
      `,
};

export const MedicalCalculationsVariablesQueries = {
  ListVariables: `
        select v.id, variableId, medicalCalculationId, optional, description, idunit, type  from variablemedicalcalculation v join variable v2 on (v.VariableId = v2.Id)
            where v.MedicalCalculationId  = ?
          `,
  ListVariableValues: `
        select value from variablevalues v where VariableId = ?;
      `,
};
