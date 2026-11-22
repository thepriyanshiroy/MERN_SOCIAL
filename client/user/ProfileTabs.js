import React, {useState} from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import FollowGrid from './../user/FollowGrid'
import PostList from './../post/PostList'

export default function ProfileTabs ( props ){
  const [tab, setTab] = useState(0)

  const handleTabChange = (event, value) => {
    setTab(value)
  }

    return (
    <div>
        <AppBar position="static" color="default">
          <Tabs
            value={tab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab
              label={`posts ${props.posts ? props.posts.length : 0}`}
              style={{ textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' }}
            />
            <Tab
              label={`following ${(props.user.following || []).length}`}
              style={{ textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' }}
            />
            <Tab
              label={`followers ${(props.user.followers || []).length}`}
              style={{ textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' }}
            />
          </Tabs>
        </AppBar>
       {tab === 0 && <TabContainer><PostList removeUpdate={props.removePostUpdate} posts={props.posts}/></TabContainer>}
       {tab === 1 && (
         <TabContainer>
           <FollowGrid
             people={props.user.following || []}
             type="following"
             isOwnProfile={props.isOwnProfile}
             onAction={props.onUnfollow}
           />
         </TabContainer>
       )}
       {tab === 2 && (
         <TabContainer>
           <FollowGrid
             people={props.user.followers || []}
             type="followers"
             isOwnProfile={props.isOwnProfile}
             onAction={props.onRemoveFollower}
           />
         </TabContainer>
       )}
    </div>)
}

ProfileTabs.propTypes = {
  user: PropTypes.object.isRequired,
  removePostUpdate: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  isOwnProfile: PropTypes.bool,
  onUnfollow: PropTypes.func,
  onRemoveFollower: PropTypes.func
}

const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}
