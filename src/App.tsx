import React from 'react';
import './App.css';
import { createGlobalStyle } from 'styled-components';
import { ThemeProvider } from '@material-ui/styles';
import { withStyles } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';
import MainView from './views/Main';
import { theme, styles } from './theme';

const GlobalStyle = createGlobalStyle`
:root {
  --background-dark: #0B0D1A;
  --background-blue: #2196f3;
  --background-light: #14172A;
  --background-bright: #564DF5;
  --text-color: #E3E5F7;
  --input-background-color: #1c1e2e;
  --input-border-color: #3c3285;
  --input-border-color-focused: #5a45ff;
  --background-checkbox: #B5B2CD;
}
body {
  background-color: #f5f7f9;
  overflow: hidden;
}
`;

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <MainView />
      </ThemeProvider>
    </Router>
  );
};

export default withStyles(styles)(App);
