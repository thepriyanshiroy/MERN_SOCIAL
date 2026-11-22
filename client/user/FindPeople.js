import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Snackbar from '@material-ui/core/Snackbar'
import { Link } from 'react-router-dom'
import SearchIcon from '@material-ui/icons/Search'
import PersonIcon from '@material-ui/icons/Person'
import { findPeople, follow, unfollow, read } from './api-user.js'
import auth from './../auth/auth-helper'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(2),
    margin: 0
  }),
  cardFollowing: {
    marginTop: theme.spacing(3)
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    gap: theme.spacing(1)
  },
  title: {
    color: theme.palette.openTitle,
    fontSize: '1.1rem',
    fontWeight: 600
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1)
  },
  searchField: {
    width: 135,
    '& .MuiOutlinedInput-input': {
      padding: '7px 8px',
      fontSize: '0.82rem'
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 20
    }
  },
  selectControl: {
    minWidth: 85,
    '& .MuiOutlinedInput-input': {
      padding: '7px 10px',
      fontSize: '0.82rem'
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 20
    }
  },
  avatar: {
    marginRight: theme.spacing(1)
  },
  profileAvatar: {
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    border: `1.5px solid ${theme.palette.secondary.main}`,
    boxShadow: '0 2px 8px rgba(94, 53, 177, 0.25)'
  },
  followActions: {
    right: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  snack: {
    color: theme.palette.protectedTitle
  },
  viewButton: {
    verticalAlign: 'middle',
    padding: 6,
    marginRight: 4
  },
  actionBtn: {
    padding: '3px 12px',
    fontSize: '0.75rem',
    minWidth: 72,
    borderRadius: 16,
    textTransform: 'none',
    fontWeight: 600
  },
  toggleBox: {
    textAlign: 'center',
    padding: theme.spacing(1),
    borderTop: '1px solid rgba(0, 0, 0, 0.08)'
  },
  toggleButton: {
    color: theme.palette.primary.main,
    fontWeight: 600,
    textTransform: 'none'
  },
  emptyNotice: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontSize: '0.9rem'
  }
}))

const isSameOrOwnUser = (u, currentUser) => {
  if (!u || !currentUser) return false
  const currentId = String(currentUser._id || '')
  const uId = String(u._id || u || '')
  if (currentId && uId && currentId === uId) return true
  const currentName = (currentUser.name || '').trim().toLowerCase()
  const uName = (u.name || '').trim().toLowerCase()
  if (currentName && uName && currentName === uName) return true
  const currentEmail = (currentUser.email || '').trim().toLowerCase()
  const uEmail = (u.email || '').trim().toLowerCase()
  if (currentEmail && uEmail && currentEmail === uEmail) return true
  return false
}

const filterAndSortProfiles = (profiles, search, filterType, currentUser) => {
  if (!profiles) return []
  let result = profiles.filter(u => u && !isSameOrOwnUser(u, currentUser))

  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim()
    result = result.filter(u => u && (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    ))
  }

  if (filterType === 'a-z') {
    result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  } else if (filterType === 'z-a') {
    result.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
  } else if (filterType === 'newest') {
    result.reverse()
  }

  return result
}

function ProfileBox({
  title,
  profiles,
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  showAll,
  onToggleShowAll,
  onActionClick,
  actionType,
  classes,
  emptyMessage,
  extraPaperClass,
  currentUser
}) {
  const filtered = filterAndSortProfiles(profiles, searchQuery, filterType, currentUser)
  const displayed = showAll ? filtered : filtered.slice(0, 5)

  return (
    <Paper className={`${classes.root} ${extraPaperClass || ''}`} elevation={4}>
      <div className={classes.header}>
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
        <div className={classes.controls}>
          <TextField
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            variant="outlined"
            size="small"
            className={classes.searchField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl variant="outlined" size="small" className={classes.selectControl}>
            <Select
              value={filterType}
              onChange={(e) => onFilterChange(e.target.value)}
              displayEmpty
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="a-z">A - Z</MenuItem>
              <MenuItem value="z-a">Z - A</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <List>
        {displayed.map((item, i) => (
          <span key={item._id || i}>
            <ListItem>
              <ListItemAvatar className={classes.avatar}>
                <Avatar
                  src={'/api/users/photo/' + item._id}
                  className={classes.profileAvatar}
                  style={{
                    backgroundColor: '#5e35b1',
                    color: '#ffffff',
                    fontWeight: 600
                  }}
                >
                  {item.name ? item.name.trim()[0].toUpperCase() : 'P'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Link to={'/user/' + item._id} style={{ color: 'inherit', fontWeight: 500 }}>
                    {item.name}
                  </Link>
                }
              />
              <ListItemSecondaryAction className={classes.followActions}>
                <Link to={'/user/' + item._id}>
                  <IconButton
                    color="secondary"
                    className={classes.viewButton}
                    aria-label="View Profile"
                    title="View Profile"
                  >
                    <PersonIcon fontSize="small" style={{ color: '#ba68c8' }} />
                  </IconButton>
                </Link>
                {actionType === 'follow' ? (
                  <Button
                    aria-label="Follow"
                    variant="contained"
                    color="primary"
                    className={classes.actionBtn}
                    onClick={() => onActionClick(item, i)}
                  >
                    Follow
                  </Button>
                ) : (
                  <Button
                    aria-label="Unfollow"
                    variant="outlined"
                    color="secondary"
                    className={classes.actionBtn}
                    onClick={() => onActionClick(item, i)}
                  >
                    Unfollow
                  </Button>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          </span>
        ))}
        {displayed.length === 0 && (
          <Typography variant="body2" className={classes.emptyNotice}>
            {searchQuery ? `No profiles matching "${searchQuery}"` : emptyMessage}
          </Typography>
        )}
      </List>
      {filtered.length > 5 && (
        <div className={classes.toggleBox}>
          <Button
            size="small"
            className={classes.toggleButton}
            onClick={onToggleShowAll}
          >
            {showAll ? 'Show Less' : `Show All (${filtered.length})`}
          </Button>
        </div>
      )}
    </Paper>
  )
}

export default function FindPeople() {
  const classes = useStyles()
  const [suggestions, setSuggestions] = useState([])
  const [following, setFollowing] = useState([])

  // Suggestions controls
  const [suggestionsSearch, setSuggestionsSearch] = useState('')
  const [suggestionsFilter, setSuggestionsFilter] = useState('all')
  const [showAllSuggestions, setShowAllSuggestions] = useState(false)

  // Following controls
  const [followingSearch, setFollowingSearch] = useState('')
  const [followingFilter, setFollowingFilter] = useState('all')
  const [showAllFollowing, setShowAllFollowing] = useState(false)

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ''
  })

  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    if (jwt && jwt.user && jwt.user._id) {
      findPeople({
        userId: jwt.user._id
      }, {
        t: jwt.token
      }, signal).then((data) => {
        if (data && data.error) {
          console.log(data.error)
        } else {
          setSuggestions((data || []).filter(u => u && !isSameOrOwnUser(u, jwt.user)))
        }
      })

      read({
        userId: jwt.user._id
      }, {
        t: jwt.token
      }, signal).then((data) => {
        if (data && data.error) {
          console.log(data.error)
        } else if (data && data.following) {
          setFollowing((data.following || []).filter(u => u && !isSameOrOwnUser(u, jwt.user)))
        }
      })
    }

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  const clickFollow = (user, index) => {
    follow({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, user._id).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setSuggestions(prev => prev.filter(u => u._id !== user._id))
        setFollowing(prev => [user, ...prev.filter(u => u._id !== user._id)])
        setSnackbar({
          open: true,
          message: `Following ${user.name}!`
        })
      }
    })
  }

  const clickUnfollow = (user, index) => {
    unfollow({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, user._id).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setFollowing(prev => prev.filter(u => u._id !== user._id))
        setSuggestions(prev => [user, ...prev.filter(u => u._id !== user._id)])
        setSnackbar({
          open: true,
          message: `Unfollowed ${user.name}!`
        })
      }
    })
  }

  const handleRequestClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const currentUser = jwt && jwt.user ? jwt.user : null

  return (
    <div>
      {/* 1. Suggestions Box (formerly "Who to follow") */}
      <ProfileBox
        title="Suggestions"
        profiles={suggestions}
        searchQuery={suggestionsSearch}
        onSearchChange={setSuggestionsSearch}
        filterType={suggestionsFilter}
        onFilterChange={setSuggestionsFilter}
        showAll={showAllSuggestions}
        onToggleShowAll={() => setShowAllSuggestions(!showAllSuggestions)}
        onActionClick={clickFollow}
        actionType="follow"
        classes={classes}
        emptyMessage="No suggestions available"
        currentUser={currentUser}
      />

      {/* 2. Following Box */}
      <ProfileBox
        title="Following"
        profiles={following}
        searchQuery={followingSearch}
        onSearchChange={setFollowingSearch}
        filterType={followingFilter}
        onFilterChange={setFollowingFilter}
        showAll={showAllFollowing}
        onToggleShowAll={() => setShowAllFollowing(!showAllFollowing)}
        onActionClick={clickUnfollow}
        actionType="unfollow"
        classes={classes}
        emptyMessage="Not following anyone yet"
        extraPaperClass={classes.cardFollowing}
        currentUser={currentUser}
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={snackbar.open}
        onClose={handleRequestClose}
        autoHideDuration={6000}
        message={<span className={classes.snack}>{snackbar.message}</span>}
      />
    </div>
  )
}
