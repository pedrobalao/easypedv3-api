export const MedicalCalculationsQueries = {
  List: `
        select id, description, resultUnitId, formula, observation, resultType, \`precision\`  from medicalcalculation m order by description
          `,
  Read: `
        select id, description, resultUnitId, formula, observation, resultType, \`precision\`  from medicalcalculation m where id = ?
      `,
};

export const MedicalCalculationsVariablesQueries = {
  ListVariables: `
        select v.id, variableId, medicalCalculationId, optional, description, idUnit, type  from variablemedicalcalculation v join variable v2 on (v.VariableId = v2.Id)
            where v.MedicalCalculationId  = ?
          `,
  ListVariableValues: `
        select value from variablevalues v where VariableId = ?;
      `,
};
