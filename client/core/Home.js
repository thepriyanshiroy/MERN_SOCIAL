import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import landingImg from './../assets/images/landing-page.jpg'
import Grid from '@material-ui/core/Grid'
import auth from './../auth/auth-helper'
import FindPeople from './../user/FindPeople'
import Newsfeed from './../post/Newsfeed'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    maxWidth: 760,
    margin: 'auto',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(5),
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(94, 53, 177, 0.18)'
  },
  title: {
    padding: `${theme.spacing(2.5)}px ${theme.spacing(3)}px ${theme.spacing(1.5)}px`,
    color: theme.palette.openTitle,
    fontWeight: 600,
    fontSize: '1.25rem'
  },
  mediaContainer: {
    position: 'relative',
    overflow: 'hidden'
  },
  media: {
    minHeight: 460,
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 10, 22, 0.45)',
    padding: theme.spacing(3),
    textAlign: 'center'
  },
  overlayTitle: {
    color: '#ffffff',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textShadow: '0 4px 18px rgba(0, 0, 0, 0.85)',
    marginBottom: theme.spacing(1.5)
  },
  overlaySubtitle: {
    color: '#ede7f6',
    fontSize: '1.15rem',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
    maxWidth: 480,
    marginBottom: theme.spacing(3)
  },
  connectButton: {
    backgroundColor: theme.palette.secondary.main,
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '1rem',
    borderRadius: 24,
    padding: '10px 32px',
    boxShadow: '0 4px 20px rgba(186, 104, 200, 0.55)',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
      boxShadow: '0 6px 24px rgba(186, 104, 200, 0.75)'
    }
  },
  welcomeText: {
    color: theme.palette.text.primary,
    fontSize: '1rem',
    textAlign: 'center',
    padding: theme.spacing(1)
  }
}))

export default function Home({history}){
  const classes = useStyles()
  const [defaultPage, setDefaultPage] = useState(false)

  useEffect(()=> {
    setDefaultPage(auth.isAuthenticated())
    const unlisten = history.listen (() => {
      setDefaultPage(auth.isAuthenticated())
    })
    return () => {
      unlisten()
    }
  }, [])

    return (
      <div className={classes.root}>
        { !defaultPage &&
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Card className={classes.card}>
                <Typography variant="h6" className={classes.title}>
                  Home Page
                </Typography>
                <div className={classes.mediaContainer}>
                  <CardMedia className={classes.media} image={landingImg} title="Let's Connect"/>
                  <div className={classes.overlay}>
                    <Typography variant="h3" className={classes.overlayTitle}>
                      Let's Connect
                    </Typography>
                    <Typography variant="subtitle1" className={classes.overlaySubtitle}>
                      Share your thoughts, connect with friends, and discover new communities.
                    </Typography>
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                      <Button variant="contained" className={classes.connectButton}>
                        Let's Connect
                      </Button>
                    </Link>
                  </div>
                </div>
                <CardContent>
                  <Typography type="body1" component="p" className={classes.welcomeText}>
                    Welcome to the MERN Social home page.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        }
        {defaultPage &&
          <Grid container spacing={8}>
            <Grid item xs={12} sm={7}>
              <Newsfeed/>
            </Grid>
            <Grid item xs={12} sm={5}>
              <FindPeople/>
            </Grid>
          </Grid>
        }
      </div>
    )
}
