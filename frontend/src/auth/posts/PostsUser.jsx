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
    let closedProfile = '';
    let counterPosts = 0;
    let disap = '';
    
    return (
    	<div>

        {posts.map((post, i) => {
          if(post.id_user == id) {
            counterPosts++;
          }
        })}
        
        <Profile counterPosts={counterPosts} />

    	  <div className="block-switch-posts">
    	    <div className="block-switch">
            <Link to={"/profile/" + id}><span className="element active">POSTS</span></Link>
            <Link to={"/profile/" + id + "/likes"}><span className="element">LIKES</span></Link>
          </div>
        </div>
        
    	  <div className="block-center">
        <div className="block-posts-profile">
        	{
            posts.map((post, i) => {
              if(post.id_user == id) {
                counterPosts++;

                image = (<img src={"/uploads/posts/" + post.post} className="postsProfile" />);
                video = (
                  <video className="postsProfile" autoPlay loop muted>
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
                      disap = "disappear";

                      return (
                        <div key={i}>
                          <Link to={"/post/" + post.id}>{block}</Link>
                        </div>  
                      )
                      }if(userProfile.is_private == 'true' && item.follower_id != localStorage.getItem('auth_id')) {
                        closedProfile = 'Закрытый профиль';
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

        </div>
        </div>
        
        <br/><br/>
        <div className="text-align-center">
          <div className={"closedProfileText " + disap}>{closedProfile}</div>
        </div>

        </div>
    )
}

export default PostsUser;