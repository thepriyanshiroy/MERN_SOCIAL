import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ArrowForward from '@material-ui/icons/ArrowForward'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Person from '@material-ui/icons/Person'
import {Link} from 'react-router-dom'
import {list} from './api-user.js'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  },
  avatar: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main
  }
}))

export default function Users() { 
  const classes = useStyles()
  const [users, setUsers] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setUsers(data)
      }
    })

    return function cleanup(){
      abortController.abort()
    }
  }, [])


    return (
      <Paper className={classes.root} elevation={4}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '12px 8px 8px' }}>
          <IconButton
            aria-label="Back"
            onClick={() => window.history.back()}
            size="small"
            style={{ color: '#5e35b1', marginRight: 8 }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" className={classes.title} style={{ margin: 0, fontWeight: 600 }}>
            All Users
          </Typography>
        </div>
        <List dense>
         {users.map((item, i) => {
          return <Link to={"/user/" + item._id} key={i}>
                    <ListItem button>
                      <ListItemAvatar>
                        <Avatar
                          src={'/api/users/photo/' + item._id}
                          className={classes.avatar}
                          style={{
                            backgroundColor: '#5e35b1',
                            color: '#ffffff',
                            fontWeight: 600
                          }}
                        >
                          {item.name ? item.name.trim()[0].toUpperCase() : 'P'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={item.name} secondary={item.email}/>
                      <ListItemSecondaryAction>
                      <IconButton>
                          <ArrowForward/>
                      </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                 </Link>
               })
             }
        </List>
      </Paper>
    )
}
