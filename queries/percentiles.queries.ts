export const PercentilesQueries = {
  Read: `
        select P01, P1, P3, P5, P10, P15, P25, P50, P75, P85, P90, P95, P97, P99, P999 from childgrowstandards a 
            where growtype = ? and gender = ? and age = ? and age_type= ?
        `,
};
