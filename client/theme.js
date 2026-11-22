import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
      primary: {
      light: '#8559da',
      main: '#5e35b1',
      dark: '#280680',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ee98fb',
      main: '#ba68c8',
      dark: '#883997',
      contrastText: '#fff',
    },
      openTitle: '#5e35b1',
      protectedTitle: '#ab47bc',
      type: 'light'
    },
    overrides: {
      MuiAvatar: {
        colorDefault: {
          backgroundColor: '#5e35b1',
          color: '#ffffff'
        }
      }
    }
  })

  export default theme  