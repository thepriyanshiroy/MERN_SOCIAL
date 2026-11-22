import React, { useState, useEffect } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import PersonIcon from '@material-ui/icons/Person'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import DeleteIcon from '@material-ui/icons/Delete'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import auth from './../auth/auth-helper'
import { remove } from './../user/api-user'
import { Link, withRouter } from 'react-router-dom'

const isActive = (history, path) => {
  if (history.location.pathname === path)
    return { color: '#ba68c8' }
  else
    return { color: '#ffffff' }
}

const Menu = withRouter(({ history }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [authVersion, setAuthVersion] = useState(Date.now())

  useEffect(() => {
    const handleAuthChange = () => setAuthVersion(Date.now())
    window.addEventListener('authChange', handleAuthChange)
    return () => window.removeEventListener('authChange', handleAuthChange)
  }, [])

  const jwt = auth.isAuthenticated()
  const user = jwt && jwt.user ? jwt.user : null
  const userName = user && user.name ? user.name : 'User'
  const userEmail = user && user.email ? user.email : ''
  const userInitial = userName.trim().length > 0 ? userName.trim()[0].toUpperCase() : 'P'
  const photoUrl = user && user._id ? `/api/users/photo/${user._id}?${user.photoVersion || authVersion}` : ''

  const handleOpenDrawer = () => {
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
  }

  const handleSignout = () => {
    setDrawerOpen(false)
    auth.clearJWT(() => history.push('/'))
  }

  const handleDeleteAccount = () => {
    if (jwt && jwt.user && jwt.user._id) {
      remove({
        userId: jwt.user._id
      }, {
        t: jwt.token
      }).then((data) => {
        if (data && data.error) {
          console.log(data.error)
        } else {
          setDeleteDialogOpen(false)
          setDrawerOpen(false)
          auth.clearJWT(() => history.push('/'))
        }
      })
    }
  }

  return (
    <AppBar position="static">
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" color="inherit" style={{ marginRight: 16, fontWeight: 600 }}>
            MERN Social
          </Typography>
          <Link to="/">
            <IconButton aria-label="Home" style={isActive(history, "/")}>
              <HomeIcon />
            </IconButton>
          </Link>
        </div>

        <div>
          {!jwt && (
            <span>
              <Link to="/signup">
                <Button style={isActive(history, "/signup")}>Sign up</Button>
              </Link>
              <Link to="/signin">
                <Button style={isActive(history, "/signin")}>Sign In</Button>
              </Link>
            </span>
          )}

          {jwt && (
            <IconButton
              onClick={handleOpenDrawer}
              aria-label="User Profile Menu"
              style={{ padding: 4 }}
            >
              <Avatar
                src={photoUrl}
                style={{
                  backgroundColor: '#ba68c8',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  width: 40,
                  height: 40,
                  border: '2px solid #ffffff',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
                  cursor: 'pointer'
                }}
              >
                {userInitial}
              </Avatar>
            </IconButton>
          )}
        </div>
      </Toolbar>

      {/* Right-side Profile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
      >
        <div style={{
          width: 290,
          height: '100%',
          boxSizing: 'border-box',
          padding: '20px 20px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={handleCloseDrawer} size="small" aria-label="Close sidebar">
                <CloseIcon />
              </IconButton>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '8px 0 16px' }}>
              <Avatar
                src={photoUrl}
                style={{
                  width: 72,
                  height: 72,
                  fontSize: '2rem',
                  fontWeight: 700,
                  backgroundColor: '#5e35b1',
                  color: '#ffffff',
                  border: '3px solid #ba68c8',
                  boxShadow: '0 4px 16px rgba(94, 53, 177, 0.35)'
                }}
              >
                {userInitial}
              </Avatar>
              <Typography variant="h6" style={{ marginTop: 12, fontWeight: 600, color: '#5e35b1' }}>
                {userName}
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginTop: 2 }}>
                {userEmail}
              </Typography>
            </div>

            <Divider />

            <List style={{ marginTop: 8 }}>
              <ListItem
                button
                onClick={() => {
                  handleCloseDrawer()
                  history.push('/user/' + (jwt && jwt.user && jwt.user._id))
                }}
              >
                <ListItemIcon>
                  <PersonIcon style={{ color: '#5e35b1' }} />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>

              <ListItem button onClick={handleSignout}>
                <ListItemIcon>
                  <ExitToAppIcon style={{ color: '#ba68c8' }} />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </ListItem>
            </List>
          </div>

          <div>
            <Divider />
            <List style={{ paddingBottom: 0, marginTop: 4 }}>
              <ListItem
                button
                onClick={() => setDeleteDialogOpen(true)}
                style={{
                  color: '#d32f2f',
                  borderRadius: 8
                }}
              >
                <ListItemIcon>
                  <DeleteIcon style={{ color: '#d32f2f' }} />
                </ListItemIcon>
                <ListItemText primary="Delete Account" />
              </ListItem>
            </List>
          </div>
        </div>
      </Drawer>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle style={{ color: '#d32f2f' }}>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action is permanent and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} style={{ color: '#d32f2f', fontWeight: 600 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  )
})

export default Menu
