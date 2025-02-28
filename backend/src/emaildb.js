import pg from 'pg';

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

const isUUID = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}'+
               '-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';

/**
 *
 * @returns {Array} return array
 */
export async function selectMailboxName() {
  const query = `
      SELECT DISTINCT mailbox.data->>'name' AS name
      FROM mailbox
    `;

  const {rows} = await pool.query(query);

  return rows.map((row) => row.name);
}

/**
 *
 * @param {string} mailbox get mailbox
 * @returns {Array} return array
 */
export async function selectMailbox(mailbox) {
  let query;
  let values = [];

  if (mailbox === '') {
    return undefined;
  }

  if (!mailbox) {
    return undefined;
  } else {
    query = `
        SELECT json_agg(jsonb_set(mail.data - 'content',
               '{id}', to_jsonb(mail.id))) AS mail
        FROM mail
        JOIN mailbox ON mail.mailbox = mailbox.id
        WHERE mailbox.data->>'name' = $1
      `;
    values = [mailbox];
  }

  const {rows} = await pool.query(query, values);

  if (mailbox && rows.length === 0 || !rows || !rows[0].mail) {
    return undefined;
  }

  return rows;
}

/**
 *
 * @param {string} id get id
 * @param {string} mailbox get mailbox
 * @returns {boolean} return boolean
 */
export async function moveMail(id, mailbox) {
  if (!(id.match(isUUID)) || !mailbox) {
    return undefined;
  }

  // Check if the mail exsit
  const mailQuery = `SELECT mailbox FROM mail WHERE id = $1`;
  const {rows: mailRows} = await pool.query(mailQuery, [id]);

  if (mailRows.length === 0) {
    return undefined;
  }

  const currentMailboxId = mailRows[0].mailbox;

  // get id of `mailbox`，if does exsit creat new
  const mailboxQuery = `SELECT id FROM mailbox WHERE data->>'name' = $1`;
  const {rows: mailboxRows} = await pool.query(mailboxQuery, [mailbox]);

  let mailboxId;
  if (mailboxRows.length === 0) {
    // `mailbox` doesn't exsit，creat new one
    return undefined;
  } else {
    mailboxId = mailboxRows[0].id;
  }

  // if `mailbox` is `sent`，but the mail not in `sent`，return `409`
  if (mailbox === 'sent') {
    return false; // `403 Conflict`
  }

  if (mailboxId === currentMailboxId) {
    return true;
  }

  // update mail's `mailbox`
  const updateQuery = `
    UPDATE mail 
    SET mailbox = $1 
    WHERE id = $2
    RETURNING id
`;
  await pool.query(updateQuery, [mailboxId, id]);

  return true;
}
