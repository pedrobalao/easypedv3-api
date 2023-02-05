export const NewsQueries = {
  List: `
    SELECT id, title, description, url, expiringDate, owner, status, coverUrl, email
        FROM news where status = 'V' and expiringDate > SYSDATE()
            `,
};
