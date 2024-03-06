export const EmergencyQueries = {
  EmergencyDrugs: `
        SELECT id, edgroup, edsubgroup, edsubgroup_title, drug, concentration, via, dose, formula, unity, max, obs
            FROM easypedprod.emergency_drugs;
      `,
};
