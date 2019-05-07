import React from 'react';
import './App.css';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import MainView from './views/Main';

const GlobalStyle = createGlobalStyle`
:root {
  --background-dark: #0B0D1A;
  --background-light: #14172A;
  --background-bright: #564DF5;
  --text-color: #E3E5F7;
  --input-background-color: #1c1e2e;
  --input-border-color: #3c3285;
  --input-border-color-focused: #5a45ff;
  --background-checkbox: #B5B2CD;
}
body {
  background-color: var(--background-dark);
  overflow: hidden;
}
`;

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyle />
      <MainView />
    </Router>
  );
};

export default App;
