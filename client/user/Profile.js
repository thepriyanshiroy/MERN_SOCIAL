import React, { useState, useEffect } from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction' 
import ListItemText from '@material-ui/core/ListItemText' 
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Person from '@material-ui/icons/Person'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Divider from '@material-ui/core/Divider'
import DeleteUser from './DeleteUser'
import auth from './../auth/auth-helper'
import {read, unfollow, removeFollower} from './api-user.js'
import {Redirect, Link} from 'react-router-dom'
import FollowProfileButton from './../user/FollowProfileButton'
import ProfileTabs from './../user/ProfileTabs'
import {listByUser} from './../post/api-post.js'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(2)}px ${theme.spacing(1)}px 0`,
    color: theme.palette.protectedTitle,
    fontSize: '1em'
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10,
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    border: `2.5px solid ${theme.palette.secondary.main}`,
    boxShadow: '0 4px 14px rgba(94, 53, 177, 0.3)'
  }
}))

export default function Profile({ match }) {
  const classes = useStyles()
  const [values, setValues] = useState({
    user: {following:[], followers:[]},
    redirectToSignin: false,
    following: false
  })
  const [posts, setPosts] = useState([])
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
  
    read({
      userId: match.params.userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, redirectToSignin: true})
      } else {
        let following = checkFollow(data)
        setValues({...values, user: data, following: following})
        loadPosts(data._id)
      }
    })
    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.userId])
  
  const checkFollow = (user) => {
    const match = user.followers.some((follower)=> {
      return follower._id == jwt.user._id
    })
    return match
  }
  const clickFollowButton = (callApi) => {
    callApi({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, values.user._id).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, user: data, following: !values.following})
      }
    })
  }
  const loadPosts = (user) => {
    listByUser({
      userId: user
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setPosts(data)
      }
    })
  }
  const removePost = (post) => {
    const updatedPosts = posts
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    setPosts(updatedPosts)
  }

  const handleUnfollowFromTab = (targetPerson) => {
    const targetId = targetPerson._id || targetPerson
    unfollow({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, targetId).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setValues(prev => ({
          ...prev,
          user: {
            ...prev.user,
            following: (prev.user.following || []).filter(p => String(p._id || p) !== String(targetId))
          }
        }))
      }
    })
  }

  const handleRemoveFollowerFromTab = (targetPerson) => {
    const targetId = targetPerson._id || targetPerson
    removeFollower({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, targetId).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setValues(prev => ({
          ...prev,
          user: {
            ...prev.user,
            followers: (prev.user.followers || []).filter(p => String(p._id || p) !== String(targetId))
          }
        }))
      }
    })
  }

    const isOwnProfile = jwt && jwt.user && (
      String(jwt.user._id) === String(match.params.userId) ||
      (values.user && values.user._id && String(jwt.user._id) === String(values.user._id)) ||
      (values.user && values.user.name && jwt.user.name && values.user.name.trim().toLowerCase() === jwt.user.name.trim().toLowerCase())
    )

    const photoUrl = values.user._id
              ? `/api/users/photo/${values.user._id}?${values.user.updated || new Date().getTime()}`
              : ''
    if (values.redirectToSignin) {
      return <Redirect to='/signin'/>
    }
    return (
      <Paper className={classes.root} elevation={4}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <IconButton
            aria-label="Back"
            onClick={() => window.history.back()}
            size="small"
            style={{ marginRight: 8, color: '#5e35b1' }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" className={classes.title} style={{ margin: 0, fontWeight: 600 }}>
            Profile
          </Typography>
        </div>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                src={photoUrl}
                className={classes.bigAvatar}
                style={{
                  backgroundColor: '#5e35b1',
                  color: '#ffffff',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  border: '2.5px solid #ba68c8',
                  boxShadow: '0 4px 14px rgba(94, 53, 177, 0.3)'
                }}
              >
                {values.user.name ? values.user.name.trim()[0].toUpperCase() : 'P'}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={values.user.name} secondary={values.user.email}/> {
             isOwnProfile
             ? (<ListItemSecondaryAction>
                  <Link to={"/user/edit/" + (values.user._id || match.params.userId)}>
                    <IconButton aria-label="Edit" color="primary">
                      <Edit/>
                    </IconButton>
                  </Link>
                  <DeleteUser userId={values.user._id || match.params.userId}/>
                </ListItemSecondaryAction>)
            : values.user && values.user._id
            ? (<FollowProfileButton following={values.following} onButtonClick={clickFollowButton}/>)
            : null
            }
          </ListItem>
          <Divider/>
          <ListItem>
            <ListItemText primary={values.user.about} secondary={"Joined: " + (
              new Date(values.user.created)).toDateString()}/>
          </ListItem>
        </List>

        <ProfileTabs
          user={values.user}
          posts={posts}
          removePostUpdate={removePost}
          isOwnProfile={isOwnProfile}
          onUnfollow={handleUnfollowFromTab}
          onRemoveFollower={handleRemoveFollowerFromTab}
        />
      </Paper>
    )
}


