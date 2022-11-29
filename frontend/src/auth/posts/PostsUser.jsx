import react, {useState, useEffect, useCallback} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import Profile from '../Profile';

const PostsUser = (props) => {
  const {id} = useParams();
	const [posts, setPosts] = useState([]);
	const [userProfile, setUser] = useState({
	  id: 0,
    username: '',
    name: '',
    bio: '',
    image: '',
    token: '',
    site: '',
    phone: '',
    is_private: '',
  });
  const [followers, setFollowers] = useState([]);

	useEffect(() => {
        axios.get(`http://localhost:8000/api/posts`).then( res => {
          if(res.data.status === 200)
          {
            setPosts(res.data.posts);
          }
          else if(res.data.status === 404)
          {
            console.log(404);
          }
        });

        axios.get(`http://localhost:8000/api/profile/${id}`).then( res => {
          if(res.data.status === 200)
          {
              setUser(res.data.user);
          }
          else if(res.data.status === 404)
          {
              history('/');
          }
        });

        axios.get(`http://localhost:8000/api/followers/`).then( res => {
            if(res.data.status === 200)
            {
              setFollowers(res.data.followers);
            }
            else if(res.data.status === 404)
            {
              history('/');
            }
        });
    }, []);

    let image = '';
    let video = '';
    let block = '';
    let data = '';
    let closedProfile = 'Закрытый профиль';
    
    return (
    	<div>
        
        <Profile />

    	<div className="block-switch-posts">
    	    <div className="block-switch">
                <Link to={"/profile/" + id}><span className="element active">POSTS</span></Link>
                <span className="element">LIKES</span>
            </div>
        </div>
    	<div className="block-center">
        <div className="block-posts-profile">
        	{
            posts.map((post, i) => {
              if(post.id_user == id) {
                image = (<img src={"/uploads/posts/" + post.post} className="postsProfile" width="300px" height="300px" />);
                video = (
                  <video className="postsProfile" width="300px" height="300px" autoPlay loop muted>
                    <source src={"/uploads/videos/" + post.post} type="video/mp4" />
                  </video>  
                );

                if(post.post.includes('.mp4') === true) {
                  block = video;
                }else {
                  block = image;
                }

                return (
                  <div key={post.id}>
                    {
                      followers.map((item, i) => {
                      if(userProfile.is_private == 'true' && item.user_id === userProfile.id && item.follower_id == localStorage.getItem('auth_id')) {
                      closedProfile = '';
                      return (
                        <div key={i}>
                          <Link to={"/post/" + post.id}>{block}</Link>
                        </div>  
                      )
                      }
                      })
                    }

                    {
                      userProfile.is_private != 'true' ? 
                      <div key={post.id}>
                        <Link to={"/post/" + post.id}>{block}</Link>
                      </div> : <div></div>
                    }
                  </div>
                )
              }
            })
          }

          {
            userProfile.is_private == 'true' ? 
            <div>{closedProfile}</div> : <div></div>
          }
        </div>
        </div>
        </div>
    )
}

export default PostsUser;