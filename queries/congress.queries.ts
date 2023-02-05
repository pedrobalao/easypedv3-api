export const CongressQueries = {
  List: `
        SELECT id, title, description, congress_type, url, expiringDate, organizer, beginDate, endDate, city, country, coverUrl 
            FROM easypedprod.congresses where status = 'V' and expiringDate > SYSDATE()
    
          `,
};
