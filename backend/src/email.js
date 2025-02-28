import * as db from './emaildb.js';

/**
 *
 * @param {object} req request
 * @param {object} res response
 */
export async function getAllMailbox(req, res) {
  const mailbox = await db.selectMailboxName();
  res.status(200).send(mailbox);
}

/**
 *
 * @param {object} req request
 * @param {object} res response
 */
export async function getMail(req, res) {
  const mail = await db.selectMailbox(req.query.mailbox);
  if (mail) {
    res.status(200).send(mail);
  } else {
    res.status(404).json({error: 'Mailbox not found'});
  }
}

/**
 *
 * @param {object} req request
 * @param {object} res response
 * @returns {object} return object
 */
export async function moveEmail(req, res) {
  const moveMail = await db.moveMail(req.params.id, req.query.mailbox);

  if (moveMail) {
    return res.status(204).send();
  } else if (moveMail === undefined) {
    return res.status(404).json({error: 'Id was invalid'});
  } else {
    return res.status(403).json({error: 'mail not in the sent'});
  }
}
