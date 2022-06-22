export const DrugsQueries = {
  SearchDrugs: `
    select distinct a.id, a.name, a.conterIndications, a.secondaryEfects as "secondaryEffects", a.comercialBrands, a.obs, a.presentation from Drug a join Indication b on (a.Id = b.DrugId) 
                    where upper(Name) like UPPER(CONCAT('%',?,'%')) or UPPER(ComercialBrands) like UPPER(CONCAT('%',?,'%')) or upper(IndicationText) like UPPER(CONCAT('%',?,'%'))
    `,
  IndicationsbyDrug: `
    select id,
    drugId,
    indicationText,
    created_at as "createdAt",
    updated_at as "updatedAt" from Indication b where b.DrugId = ?   
    `,
  DosesByIndication: `
    select id,
    indicationId,
    idVia,
    pediatricDose,
    idUnityPediatricDose,
    adultDose,
    idUnityAdultDose,
    takesPerDay,
    maxDosePerDay,
    idUnityMaxDosePerDay,
    obs,
    created_at as "createdAt",
    updated_at as "updatedAt" from Dose b where b.IndicationId = ?   
    `,
  VariablesByDrug: `
    select v.id,
    v.description,
    v.idUnit,
    v.type,
    v.created_at as "createdAt",
    v.updated_at as "updatedAt" from variable v join variabledrug v2 on v.Id = v2.VariableId where v2.DrugId = ?   
    `,
  CalculationsByDrug: `
    select id,
    drugId,
    type,
    function,
    resultDescription,
    resultIdUnit,
    description,
    created_at as "createdAt",
    updated_at as "updatedAt"
     from calculation c where c.DrugId = ?  
    `,
  DrugById: `
    select a.id, a.name, a.conterIndications, a.secondaryEfects as "secondaryEffects", a.comercialBrands, a.obs, a.presentation from Drug a where a.Id = ? 
  `,
};
