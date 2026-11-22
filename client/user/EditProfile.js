import React, {useEffect, useState} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'
import InputAdornment from '@material-ui/core/InputAdornment'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { makeStyles } from '@material-ui/core/styles'
import auth from './../auth/auth-helper'
import {read, update} from './api-user.js'
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  }
}))

export default function EditProfile({ match }) {
  const classes = useStyles()
  const [values, setValues] = useState({
    name: '',
    about: '',
    photo: '',
    email: '',
    password: '',
    redirectToProfile: false,
    error: '',
    id: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [photoPreview, setPhotoPreview] = useState('')
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: match.params.userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data & data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, id: data._id, name: data.name, email: data.email, about: data.about})
      }
    })
    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.userId])
  
  const clickSubmit = () => {
    let userData = new FormData()
    values.name && userData.append('name', values.name)
    values.email && userData.append('email', values.email)
    values.password && userData.append('password', values.password)
    values.about && userData.append('about', values.about)
    values.photo && userData.append('photo', values.photo)
    update({
      userId: match.params.userId
    }, {
      t: jwt.token
    }, userData).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        auth.updateUser(data, () => {
          setValues({...values, 'redirectToProfile': true})
        })
      }
    })
  }
  const handleChange = name => event => {
    if (name === 'photo') {
      const file = event.target.files[0]
      setValues({ ...values, photo: file })
      if (file) {
        setPhotoPreview(URL.createObjectURL(file))
      }
    } else {
      setValues({ ...values, [name]: event.target.value })
    }
  }
  const photoUrl = photoPreview || (values.id
    ? `/api/users/photo/${values.id}?${new Date().getTime()}`
    : '')
    if (values.redirectToProfile) {
      return (<Redirect to={'/user/' + values.id}/>)
    }
    return (
      <Card className={classes.card}>
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 12px' }}>
            <IconButton
              aria-label="Back"
              onClick={() => window.history.back()}
              size="small"
              style={{ color: '#5e35b1' }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" className={classes.title} style={{ margin: 0, fontWeight: 600 }}>
              Edit Profile
            </Typography>
            <div style={{ width: 28 }} />
          </div>
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
            {values.name ? values.name.trim()[0].toUpperCase() : 'P'}
          </Avatar><br/>
          <input accept="image/*" onChange={handleChange('photo')} className={classes.input} id="icon-button-file" type="file" />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="default" component="span">
              Upload
              <FileUpload/>
            </Button>
          </label> <span className={classes.filename}>{values.photo ? values.photo.name : ''}</span><br/>
          <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
          <TextField
            id="multiline-flexible"
            label="About"
            multiline
            rows="2"
            value={values.about}
            onChange={handleChange('about')}
            className={classes.textField}
            margin="normal"
          /><br/>
          <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 4,
            gap: 8
          }}>
            <VpnKeyIcon style={{ color: '#5e35b1' }} />
            <Typography variant="subtitle1" style={{ fontWeight: 600, color: '#5e35b1' }}>
              Change Password
            </Typography>
          </div>
          <TextField
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="New Password"
            className={classes.textField}
            value={values.password}
            onChange={handleChange('password')}
            margin="normal"
            helperText="Leave blank to keep current password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon style={{ color: '#ba68c8' }} fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
    )
}
