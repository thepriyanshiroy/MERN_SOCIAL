import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    background: theme.palette.background.paper
  },
  avatar: {
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    fontWeight: 600
  },
  viewButton: {
    padding: 6,
    marginRight: 6,
    color: '#ba68c8'
  },
  actionBtn: {
    padding: '3px 12px',
    fontSize: '0.75rem',
    minWidth: 72,
    borderRadius: 16,
    textTransform: 'none',
    fontWeight: 600
  },
  removeBtn: {
    padding: '3px 12px',
    fontSize: '0.75rem',
    minWidth: 72,
    borderRadius: 16,
    textTransform: 'none',
    fontWeight: 600,
    color: '#d32f2f',
    borderColor: '#d32f2f',
    '&:hover': {
      backgroundColor: 'rgba(211, 47, 47, 0.08)',
      borderColor: '#d32f2f'
    }
  },
  emptyNotice: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontSize: '0.9rem'
  }
}))

export default function FollowGrid(props) {
  const classes = useStyles()
  const people = props.people || []

  return (
    <div className={classes.root}>
      <List>
        {people.map((person, i) => {
          const personId = person._id || person
          const personName = person.name || 'User'
          const initial = personName.trim().length > 0 ? personName.trim()[0].toUpperCase() : 'P'

          return (
            <ListItem key={personId || i} divider={i < people.length - 1}>
              <ListItemAvatar>
                <Avatar
                  src={'/api/users/photo/' + personId}
                  className={classes.avatar}
                >
                  {initial}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Link
                    to={'/user/' + personId}
                    style={{ color: 'inherit', fontWeight: 500, textDecoration: 'none' }}
                  >
                    {personName}
                  </Link>
                }
              />
              <ListItemSecondaryAction>
                {/* View button as given on home page */}
                <Link to={'/user/' + personId}>
                  <IconButton
                    color="secondary"
                    className={classes.viewButton}
                    aria-label="View Profile"
                    title="View Profile"
                    size="small"
                  >
                    <PersonIcon fontSize="small" />
                  </IconButton>
                </Link>

                {/* Unfollow option under following */}
                {props.isOwnProfile && props.type === 'following' && props.onAction && (
                  <Button
                    aria-label="Unfollow"
                    variant="outlined"
                    color="secondary"
                    className={classes.actionBtn}
                    onClick={() => props.onAction(person)}
                  >
                    Unfollow
                  </Button>
                )}

                {/* Remove option under followers */}
                {props.isOwnProfile && props.type === 'followers' && props.onAction && (
                  <Button
                    aria-label="Remove"
                    variant="outlined"
                    className={classes.removeBtn}
                    onClick={() => props.onAction(person)}
                  >
                    Remove
                  </Button>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          )
        })}
        {people.length === 0 && (
          <Typography variant="body2" className={classes.emptyNotice}>
            {props.type === 'following' ? 'Not following anyone yet' : 'No followers yet'}
          </Typography>
        )}
      </List>
    </div>
  )
}

FollowGrid.propTypes = {
  people: PropTypes.array.isRequired,
  type: PropTypes.string,
  isOwnProfile: PropTypes.bool,
  onAction: PropTypes.func
}
