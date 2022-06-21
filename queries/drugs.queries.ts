export const DrugsQueries = {
  SearchDrugs: `
    select distinct a.id, a.name, a.conterIndications, a.secondaryEfects as "secondaryEffects", a.comercialBrands, a.obs, a.presentation from Drug a join Indication b on (a.Id = b.DrugId) 
                    where upper(Name) like UPPER(CONCAT('%',?,'%')) or UPPER(ComercialBrands) like UPPER(CONCAT('%',?,'%')) or upper(IndicationText) like UPPER(CONCAT('%',?,'%'))
    `,
  IndicationsbyDrug: `
    select * from Indication b where b.DrugId = ?   
    `,
  DosesByIndication: `
    select * from Dose b where b.IndicationId = ?   
    `,
  VariablesByDrug: `
    select v.* from variable v join variabledrug v2 on v.Id = v2.VariableId where v2.DrugId = ?   
    `,
  CalculationsByDrug: `
    select c.* from calculation c where c.DrugId = ?  
    `,
  DrugById: `
    select v.* from Drug v where v.Id = ? 
  `,
};
