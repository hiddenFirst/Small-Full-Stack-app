import {useEffect, useState, useRef} from 'react';
import {List, ListItem, Typography, Box, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {useMail} from './App';
import {formatDate} from './utils';

/**
 * @returns {object} return JSX
 */
function EmailList() {
  const {selectedMailbox} = useMail();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const fetchEmails = (mailbox) => {
    if (mailbox) {
      const lowercaseMailbox = mailbox.toLowerCase();
      fetch(`http://localhost:3010/api/v0/mail?mailbox=${lowercaseMailbox}`)
          .then((res) => res.json())
          .then((data) => {
            const sortedEmails = data[0].mail.sort((a, b) =>
              new Date(b.received) - new Date(a.received));
            setEmails(sortedEmails);
          }).finally(() => setLoading(false));
    }
  };
  useEffect(() => {
    fetchEmails(selectedMailbox);
    setLoading(true);
  }, [selectedMailbox]);

  const handleMoveToTrash = (emailId) => {
    fetch(`http://localhost:3010/api/v0/mail/${emailId}?mailbox=trash`, {method: 'PUT'})
        .then((res) => {
          if (res.ok) {
            setEmails((prevEmails) =>
              prevEmails.filter((email) => email.id !== emailId));
          }
        });
  };

  useEffect(() => {
    if (listRef.current) {
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollTop = 0;
        }
      }, 0);
    }
  }, [selectedMailbox]);

  const ariaLabelForDelete = (selectedMailbox, email) => {
    if (selectedMailbox === 'Sent') {
      return `Delete mail to ${email.to.name}
              sent ${formatDate(email.received)}`.replace(/\s+/g, ' ');
    } else {
      return `Delete mail from ${email.from.name}
              received ${formatDate(email.received)}`.replace(/\s+/g, ' ');
    }
  };

  const nameInDifferentMailList = (selectedMailbox, email) => {
    if (selectedMailbox === 'Sent') {
      return email.to.name;
    } else if (selectedMailbox === 'Trash') {
      if (email.from.name === 'CSE186 Student') {
        return `CSE186 Student to ${email.to.name}`;
      }
      return `${email.from.name} to CSE186 Student`;
    } else {
      return email.from.name;
    }
  };

  return (
    <Box
      aria-label="email-list"
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        maxHeight: '100%',
      }}
      ref={listRef}
    >
      {loading ? (
      <Typography>Loading...</Typography>
    ) : (
        <List aria-label="listItem" sx={{overflowY: 'auto', width: '90%'}}>
          {emails.map((email) => (
            <ListItem
              button
              key={email.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '90%',
              }}
            >
              <IconButton
                aria-label= {ariaLabelForDelete(selectedMailbox, email)}
                onClick={() => handleMoveToTrash(email.id)}
                disabled={selectedMailbox === 'Trash'}
              >
                <DeleteIcon />
              </IconButton>

              <Box sx={{flex: 1, display: 'flex',
                flexDirection: 'column', paddingLeft: 3}}>
                <Typography
                  aria-label="emailSenderList"
                  variant="body1"
                  sx={{
                    flex: 1,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {nameInDifferentMailList(selectedMailbox, email)}
                </Typography>

                <Typography
                  aria-label="emailSubjectList"
                  variant="body2"
                  sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    color: 'gray',
                  }}
                >
                  {email.subject}
                </Typography>

              </Box>

              <Typography
                variant="body2"
                aria-label="emailTimeList"
                sx={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {formatDate(email.received)}
              </Typography>
            </ListItem>
          ))}
        </List>
    )}

    </Box>
  );
}

export default EmailList;
