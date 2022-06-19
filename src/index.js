import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { WalletProvider } from '@tezos-contrib/react-wallet-provider';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import './index.css';
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <WalletProvider name="livefeed" clientType="beacon">
        <CssBaseline />
        <App />
      </WalletProvider>
    </ThemeProvider>
  </React.StrictMode>
);
