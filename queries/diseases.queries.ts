export const DiseasesQueries = {
  List: `
        select id, description from diseases where status = 'active' order by description
        `,
  Search: `
        SELECT id, description, indication FROM diseases WHERE status = 'active' and MATCH (description, indication)
        AGAINST (? IN BOOLEAN MODE) LIMIT 50
    `,
  Read: `
        select id, description, author, indication, followup, example, bibliography, observation, created_at, updated_at, status, treatment treatmentstr, general_measures from diseases where status = 'active' and id = ?
    `,
};
