import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import theme from './theme';
import './index.css';
import App from './components/App';
import { WalletProvider } from './libs/wallet-provider';

TimeAgo.addDefaultLocale(en);

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
