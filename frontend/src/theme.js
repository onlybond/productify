import { createTheme } from '@mui/material';

const theme = createTheme({
  palette:{
    mode:"light",
  },
  breakpoints: {
    values: {
      xs: 0, // extra-small
      sm: 600, // small
      md: 960, // medium
      lg: 1280, // large
      xl: 1920, // extra-large
    },
  }

  // Other theme settings...
});

export default theme;
