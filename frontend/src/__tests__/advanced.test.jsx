import {it, expect, test,
  beforeAll, afterEach, afterAll, vi} from 'vitest';
import {render, screen, within,
  fireEvent, waitFor} from '@testing-library/react';
import {MailContext} from '../App';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import Header from '../Header';
import Sidebar from '../Sidebar';
import EmailList from '../EmailList';

const URL = 'http://localhost:3010/api/v0/mailbox';
const URL2 = 'http://localhost:3010/api/v0/mail';
const server = setupServer(
    // Mock `/api/v0/mailbox`
    http.get(URL, async () => {
      return HttpResponse.json(['Inbox', 'Sent', 'Trash'], {status: 200});
    }),

);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders the HeaderBar with the correct mailbox name', () => {
  render(
      <MailContext.Provider value={{selectedMailbox: 'Inbox'}}>
        <Header />
      </MailContext.Provider>,
  );

  expect(screen.getByText('CSE186 Full Stack Mail - Inbox'))
      .toBeInTheDocument();
});

it('check mailbox inbox from mock API', async () => {
  render(
      <MailContext.Provider value={{selectedMailbox: 'Inbox'}}>
        <Sidebar />
      </MailContext.Provider>,
  );

  const emailList = screen.getByLabelText('sidebar');
  expect(await within(emailList).findByText('Inbox'))
      .toBeInTheDocument();
});

it('check mailbox sent from mock API', async () => {
  render(
      <MailContext.Provider value={{selectedMailbox: 'Inbox'}}>
        <Sidebar />
      </MailContext.Provider>,
  );

  const emailList = screen.getByLabelText('sidebar');
  expect(await within(emailList).findByText('Sent'))
      .toBeInTheDocument();
});

it('check mailbox trash from mock API', async () => {
  render(
      <MailContext.Provider value={{selectedMailbox: 'Inbox'}}>
        <Sidebar />
      </MailContext.Provider>,
  );

  const emailList = screen.getByLabelText('sidebar');
  expect(await within(emailList).findByText('Trash'))
      .toBeInTheDocument();
});

it('click sent mailbox Header change', async () => {
  render(
      <MailContext.Provider value={{selectedMailbox: 'Sent'}}>
        <Header />
      </MailContext.Provider>,
  );

  expect(screen.getByText('CSE186 Full Stack Mail - Sent'))
      .toBeInTheDocument();
});

it('click sent mailbox called setSelectedMailbox', async () => {
  const setSelectedMailbox = vi.fn();
  render(
      <MailContext.Provider value={{selectedMailbox: 'Inbox',
        setSelectedMailbox}}>
        <Sidebar />
      </MailContext.Provider>,
  );

  const sidebar = await screen.findByLabelText('sidebar');
  const sentMailbox = await within(sidebar)
      .findByText('Sent');
  fireEvent.click(sentMailbox);

  expect(setSelectedMailbox).toHaveBeenCalledWith('Sent');
});

it('check mailList inbox from mock API', async () => {
  server.use(
      // Mock `/api/v0/mail?mailbox=inbox`
      http.get(URL2, async () => {
        return HttpResponse.json(
            [{mail: [{
              'id': '38612de6-3cd1-4659-a8c2-e9b38db7a070',
              'to': {
                'name': 'CSE186 Student',
                'email': 'CSE186student@ucsc.edu'},
              'from': {
                'name': 'Jillene Haylands',
                'email': 'jhaylandsu@163.com'},
              'sent': '2019-12-27T02:24:00Z',
              'subject': 'Synergized coherent throughput',
              'received': '2024-10-09T08:53:24Z',
            }]}], {status: 200},
        );
      }),
  );
  render(
      <MailContext.Provider value={{selectedMailbox: 'Inbox'}}>
        <EmailList />
      </MailContext.Provider>,
  );

  const emailList = screen.getByLabelText('email-list');
  expect(await within(emailList).findByText('Jillene Haylands'))
      .toBeInTheDocument();
});

it('check mailList sent from mock API', async () => {
  server.use(
      http.get(URL2, async () => {
        return HttpResponse.json(
            [{mail: [{
              'id': '3116d3c1-57c5-4486-9b84-4d83c94481e7',
              'to': {'name': 'Shandra Rheam', 'email': 'srheam0@myspace.com'},
              'from': {
                'name': 'CSE186 Student',
                'email': 'CSE186student@ucsc.edu'},
              'sent': '2024-11-14T17:09:17Z',
              'subject': 'Compatible demand-driven definition',
              'received': '2024-11-17T23:17:19Z',
            }]}], {status: 200},
        );
      }),
  );

  render(
      <MailContext.Provider value={{selectedMailbox: 'Sent'}}>
        <EmailList />
      </MailContext.Provider>,
  );

  const emailList = screen.getByLabelText('email-list');
  const emailSubject = await within(emailList)
      .findByText('Shandra Rheam');
  expect(emailSubject).toBeInTheDocument();
});

it('check mailList sent date from mock API', async () => {
  server.use(
      http.get(URL2, async () => {
        return HttpResponse.json(
            [{mail: [{
              'id': '3116d3c1-57c5-4486-9b84-4d83c94481e7',
              'to': {
                'name': 'Shandra Rheam',
                'email': 'srheam0@myspace.com'},
              'from': {
                'name': 'CSE186 Student',
                'email': 'CSE186student@ucsc.edu'},
              'sent': '2024-11-14T17:09:17Z',
              'subject': 'Compatible demand-driven definition',
              'received': '2024-11-17T23:17:19Z',
            }]}], {status: 200},
        );
      }),
  );

  render(
      <MailContext.Provider value={{selectedMailbox: 'Sent'}}>
        <EmailList />
      </MailContext.Provider>,
  );

  const emailList = screen.getByLabelText('email-list');
  expect(await within(emailList)
      .findByText('Nov 17'))
      .toBeInTheDocument();
});

it('check mailList sent name from mock API', async () => {
  server.use(
      http.get(URL2, async () => {
        return HttpResponse.json(
            [{mail: [{
              'id': '3116d3c1-57c5-4486-9b84-4d83c94481e7',
              'to': {
                'name': 'Shandra Rheam',
                'email': 'srheam0@myspace.com'},
              'from': {
                'name': 'CSE186 Student',
                'email': 'CSE186student@ucsc.edu'},
              'sent': '2024-11-14T17:09:17Z',
              'subject': 'Compatible demand-driven definition',
              'received': '2024-11-17T23:17:19Z',
            }]}], {status: 200},
        );
      }),
  );

  render(
      <MailContext.Provider value={{selectedMailbox: 'Sent'}}>
        <EmailList />
      </MailContext.Provider>,
  );

  const emailList = screen.getByLabelText('email-list');
  expect(await within(emailList)
      .findByText('Shandra Rheam'))
      .toBeInTheDocument();
});

it('check mail in trash from mock API', async () => {
  server.use(
      http.get(URL2, async () => {
        return HttpResponse.json(
            [{mail: [{
              'id': '1cb77c1b-381f-48bf-9499-a4078f488d0e',
              'to': {
                'name': 'CSE186 Student',
                'email': 'CSE186student@ucsc.edu',
              },
              'from': {
                'name': 'Frannie Bridle',
                'email': 'fbridle1v@sourceforge.net',
              },
              'sent': '2024-01-04T02:45:44Z',
              'subject': 'Right-sized 3rd generation functionalities',
              'received': '2024-09-23T14:43:23Z',
            }]}], {status: 200},
        );
      }),
  );
  render(
      <MailContext.Provider value={{selectedMailbox: 'Trash'}}>
        <EmailList />
      </MailContext.Provider>,
  );

  const emailListAfter = await screen.findByLabelText('email-list');

  expect(await within(emailListAfter)
      .findByText('Frannie Bridle to CSE186 Student'))
      .toBeInTheDocument();
});

it('check mail in trash from sent from mock API', async () => {
  server.use(
      http.get(URL2, async () => {
        return HttpResponse.json(
            [{mail: [{
              'id': '7ce2399f-53dc-45f6-aa27-1fbc12fc7ccd',
              'to': {
                'name': 'Shandra Rheam',
                'email': 'srheam0@myspace.com',
              },
              'from': {
                'name': 'CSE186 Student',
                'email': 'CSE186student@ucsc.edu',
              },
              'sent': '2024-11-14T17:09:17Z',
              'subject': 'Compatible demand-driven definition',
              'received': '2024-11-17T23:17:19Z',
            }]}], {status: 200},
        );
      }),
  );
  render(
      <MailContext.Provider value={{selectedMailbox: 'Trash'}}>
        <EmailList />
      </MailContext.Provider>,
  );

  const emailListAfter = await screen.findByLabelText('email-list');

  expect(await within(emailListAfter)
      .findByText('CSE186 Student to Shandra Rheam'))
      .toBeInTheDocument();
});

it('check Delete mail in inbox to see if exsit', async () => {
  server.use(
      // Mock `/api/v0/mail?mailbox=inbox`
      http.get(URL2, async () => {
        return HttpResponse.json(
            [{mail: [{
              'id': '38612de6-3cd1-4659-a8c2-e9b38db7a070',
              'to': {
                'name': 'CSE186 Student',
                'email': 'CSE186student@ucsc.edu'},
              'from': {
                'name': 'Jillene Haylands',
                'email': 'jhaylandsu@163.com'},
              'sent': '2019-12-27T02:24:00Z',
              'subject': 'Synergized coherent throughput',
              'received': '2024-10-09T08:53:24Z',
            }]}], {status: 200},
        );
      }),
  );

  server.use(
      http.put(`http://localhost:3010/api/v0/mail/:id`,
          async () => {
            return HttpResponse.json({status: 204});
          }),
  );

  render(
      <MailContext.Provider value={{selectedMailbox: 'Inbox'}}>
        <EmailList />
      </MailContext.Provider>,
  );

  const emailList = await screen.findByLabelText('email-list');
  const deleteIcon = await within(emailList)
      .findByLabelText('Delete mail from Jillene Haylands received Oct 09');
  fireEvent.click(deleteIcon);

  await waitFor(() => {
    const updatedEmailList = screen.getByLabelText('email-list');
    expect(within(updatedEmailList).queryByText('Jillene Haylands'))
        .not.toBeInTheDocument();
  });
});
