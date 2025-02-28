import {beforeAll, afterAll, test, expect} from 'vitest';
import supertest from 'supertest';
import http from 'http';

import * as db from './db.js';
import app from '../src/app.js';

let server;
let request;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll(async () => {
  db.close();
  await server.close();
});

test('GET All Mailbox name Return Code', async () => {
  await request.get('/api/v0/mailbox')
      .expect(200);
});

test('GET Mailbox Name Content Type', async () => {
  await request.get('/api/v0/mailbox')
      .then((data) => {
        expect(Array.isArray(data.body)).toBe(true);
      });
});

test('GET Mailbox Name inside Content Type', async () => {
  await request.get('/api/v0/mailbox')
      .then((data) => {
        expect(data.body.every((item) => typeof item === 'string')).toBe(true);
      });
});

test('GET Mailbox=inbox Return Code', async () => {
  await request.get('/api/v0/mail?mailbox=inbox')
      .expect(200);
});

test('GET Mailbox=sent Return Code', async () => {
  await request.get('/api/v0/mail?mailbox=sent')
      .expect(200);
});

test('GET Mailbox=trash Return Code', async () => {
  await request.get('/api/v0/mail?mailbox=trash')
      .expect(200);
});

test('GET Mailbox=inbox Content Type', async () => {
  await request.get('/api/v0/mail?mailbox=inbox')
      .then((data) => {
        expect(Array.isArray(data.body)).toBe(true);
      });
});

test('GET Mailbox=sent Content Type', async () => {
  await request.get('/api/v0/mail?mailbox=sent')
      .then((data) => {
        expect(Array.isArray(data.body)).toBe(true);
      });
});

test('GET Mailbox=trash Content Type', async () => {
  await request.get('/api/v0/mail?mailbox=trash')
      .then((data) => {
        expect(Array.isArray(data.body)).toBe(true);
      });
});

test('GET Mailbox=inbox Content Type Structure', async () => {
  await request.get('/api/v0/mail?mailbox=inbox')
      .then((data) => {
        expect(Array.isArray(data.body[0].mail)).toBe(true);
      });
});

test('GET Mailbox=a Unknow mailbox Return Code', async () => {
  await request.get('/api/v0/mail?mailbox=a')
      .expect(404);
});

test('GET Mailbox With No Name Return Code', async () => {
  await request.get('/api/v0/mail?mailbox=')
      .expect(404);
});

test('GET Without Mailbox Return Code', async () => {
  await request.get('/api/v0/mail')
      .expect(404);
});

test('PUT inbox to trash', async () => {
  const inboxMails = await request.get('/api/v0/mail?mailbox=inbox');

  const firstMailbox = inboxMails.body[0];

  const firstMailId = firstMailbox.mail[0].id;

  await request.put(`/api/v0/mail/${firstMailId}?mailbox=trash`)
      .expect(204);
});

test('PUT trash to inbox', async () => {
  const inboxMails = await request.get('/api/v0/mail?mailbox=trash');

  const firstMailbox = inboxMails.body[0];

  const firstMailId = firstMailbox.mail[0].id;

  await request.put(`/api/v0/mail/${firstMailId}?mailbox=inbox`)
      .expect(204);
});

test('PUT inbox to sent', async () => {
  const inboxMails = await request.get('/api/v0/mail?mailbox=inbox');

  const firstMailbox = inboxMails.body[0];

  const firstMailId = firstMailbox.mail[0].id;

  await request.put(`/api/v0/mail/${firstMailId}?mailbox=sent`)
      .expect(403);
});

test('PUT sent to sent', async () => {
  const inboxMails = await request.get('/api/v0/mail?mailbox=sent');

  const firstMailbox = inboxMails.body[0];

  const firstMailId = firstMailbox.mail[0].id;

  await request.put(`/api/v0/mail/${firstMailId}?mailbox=sent`)
      .expect(403);
});

test('PUT inbox to inbox', async () => {
  const inboxMails = await request.get('/api/v0/mail?mailbox=inbox');

  const firstMailbox = inboxMails.body[0];

  const firstMailId = firstMailbox.mail[0].id;

  await request.put(`/api/v0/mail/${firstMailId}?mailbox=inbox`)
      .expect(204);
});

test('PUT sent to inbox', async () => {
  const inboxMails = await request.get('/api/v0/mail?mailbox=sent');

  const firstMailbox = inboxMails.body[0];

  const firstMailId = firstMailbox.mail[0].id;

  await request.put(`/api/v0/mail/${firstMailId}?mailbox=inbox`)
      .expect(204);
});

test('PUT if the mail in trash after inbox to trash', async () => {
  const inboxMails = await request.get('/api/v0/mail?mailbox=inbox');

  const firstMailbox = inboxMails.body[0];

  const firstMailId = firstMailbox.mail[0].id;

  await request.put(`/api/v0/mail/${firstMailId}?mailbox=trash`);

  const response2 = await request.get('/api/v0/mail?mailbox=trash');

  const trashMails = response2.body[0].mail;
  const newMail = trashMails.find((mail) => mail.id === firstMailId);
  expect(newMail).toBeDefined();
});

test('PUT if mail remove from inbox after moving to trash', async () => {
  const inboxMails = await request.get('/api/v0/mail?mailbox=inbox');

  const firstMailbox = inboxMails.body[0];

  const firstMailId = firstMailbox.mail[0].id;

  await request.put(`/api/v0/mail/${firstMailId}?mailbox=trash`);

  const response2 = await request.get('/api/v0/mail?mailbox=inbox');

  const updatedInboxMails = response2.body[0].mail;
  expect(updatedInboxMails.some((mail) => mail.id === firstMailId)).toBe(false);
});

test('PUT ID was not valid UUID Return Code', async () => {
  await request.put('/api/v0/mail/12345?mailbox=trash')
      .expect(404);
});

test('PUT valid UUID but not exist Return Code', async () => {
  await request
      .put('/api/v0/mail/aaaaaaaa-eeee-4562-b3fc-2c963f66afa6?mailbox=trash')
      .expect(404);
});

test('PUT mailbox is empty', async () => {
  const inboxMails = await request.get('/api/v0/mail?mailbox=inbox');

  const firstMailbox = inboxMails.body[0];

  const firstMailId = firstMailbox.mail[0].id;

  await request.put(`/api/v0/mail/${firstMailId}?mailbox=`)
      .then((res) => {
        expect(res.status).not.toBe(204);
      });
});

test('PUT mailbox not exist', async () => {
  const inboxMails = await request.get('/api/v0/mail?mailbox=inbox');

  const firstMailbox = inboxMails.body[0];

  const firstMailId = firstMailbox.mail[0].id;

  await request.put(`/api/v0/mail/${firstMailId}?mailbox=important`)
      .expect(404);
});

test('PUT test inbox still in inbox after fail None mailbox', async () => {
  const inboxMails = await request.get('/api/v0/mail?mailbox=inbox');

  const firstMailbox = inboxMails.body[0];

  const firstMailId = firstMailbox.mail[0].id;

  await request.put(`/api/v0/mail/${firstMailId}?mailbox=`);

  const inboxMails2 = firstMailbox.mail;
  const oldMail = inboxMails2.find((mail) => mail.id === firstMailId);
  expect(oldMail).toBeDefined();
});
