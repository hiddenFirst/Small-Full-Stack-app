/*
#######################################################################
#
# Copyright (C) 2020-2025 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

import {createContext, useContext, useState} from 'react';
import {CssBaseline, Box, Grid} from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import EmailList from './EmailList';


export const MailContext = createContext();
export const useMail = () => useContext(MailContext);
/**
 * Simple component with no state.
 * @returns {object} JSX
 */
function App() {
  const [selectedMailbox, setSelectedMailbox] = useState('Inbox');
  return (
    <MailContext.Provider
      value={{
        selectedMailbox,
        setSelectedMailbox,
      }}
    >
      <CssBaseline />
      <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
        <Header />

        <Grid container sx={{flexGrow: 1,
          height: 'calc(100vh - 64px)',
          overflow: 'hidden'}}>
          <Grid item xs='2'>
            <Sidebar />
          </Grid>

          <Grid
            item
            xs='10'
            sx={{
              backgroundColor: 'white',
              padding: 2,
              height: '100%',
              borderRight: '1px solid #ddd',
            }}
          >
            <EmailList />
          </Grid>
        </Grid>
      </Box>
    </MailContext.Provider>
  );
}

export default App;
