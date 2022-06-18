import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet_portrait: 750,
      tablet_short: 900,
      tablet: 1050,
      laptop: 1400,
      desktop: 1700,
      maximum: 2050,
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#10b981',
    },
    secondary: {
      main: '#939ef5',
    },
    background: {
      default: '#0b0f19',
      paper: '#1d2332',
    },
    info: {
      main: '#FFFFFF',
    },
    success: {
      main: '#FFFFFF',
    },
    warning: {
      main: '#FFCC00',
    },
    error: {
      main: '#FFFFFF',
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        label: {
          fontSize: '0.7rem',
          fontWeight: '600',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: '0px 15px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          backgroundColor: '#1d2332',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
          padding: 0,
          borderBottom: 0,
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: 0,
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          marginRight: '10px',
        },
      },
    },
  },
});

theme.typography.h1 = {
  fontSize: '2.8rem',
  [theme.breakpoints.down('tablet_portrait')]: {
    fontSize: '1.6rem',
  },
};

theme.typography.body2 = {
  fontSize: '0.9rem',
  lineHeight: 2,
};

export default theme;
