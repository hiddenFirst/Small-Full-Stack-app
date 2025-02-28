import {AppBar, Toolbar, Typography} from '@mui/material';
import {useMail} from './App';

/**
 * @returns {object} return object
 */
function Header() {
  const {selectedMailbox} = useMail();

  return (
    <AppBar aria-label='header' position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            whiteSpace: 'nowrap',
            display: 'inline-block',
          }}
        >
          CSE186 Full Stack Mail - {selectedMailbox.trim()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}


export default Header;
