import {useEffect, useState} from 'react';
import {Drawer, List, ListItem,
  ListItemIcon, ListItemText} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import EmailIcon from '@mui/icons-material/Email';
import {useMail} from './App';

/**
 * @returns {object} return JSX
 */
function Sidebar() {
  const {selectedMailbox, setSelectedMailbox} = useMail();
  const [mailboxes, setMailboxes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3010/api/v0/mailbox')
        .then((res) => res.json())
        .then((data) => {
          const formattedMailboxes = data
              .map((mailbox) => mailbox.charAt(0)
                  .toUpperCase()+mailbox.slice(1))
              .sort();
          setMailboxes(formattedMailboxes);
        })
        .catch((error) => console.error('Failed to fetch mailboxes:', error));
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        'width': '17%',
        '& .MuiDrawer-paper': {width: '17%', marginTop: '64px'},
      }}
    >
      <List aria-label="sidebar">
        {mailboxes.map((mailbox) => (
          <ListItem
            button
            key={mailbox}
            onClick={() => setSelectedMailbox(mailbox)}
          >
            <ListItemIcon>
              {mailbox === selectedMailbox ?
                <MailOutlineIcon color="primary" /> : <EmailIcon />}
            </ListItemIcon>
            <ListItemText primary={mailbox} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
