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
    let bool = false;
    
    return (
    	<div>
        
        <Profile bool={bool} />

    	<div className="block-switch-posts">
    	    <div className="block-switch">
                <Link to={"/profile/" + id}><span className="element active">POSTS</span></Link>
                <span className="element">LIKES</span>
            </div>
        </div>
    	<div className="block-center">
        <div className="block-posts-profile">
        	{
            followers.map((item, i) => {
            if(userProfile.id == item.user_id) {
            	return (
            	<div>
        		{posts.map((post, i) => {
                if(id == post.id_user && userProfile.is_private == 'true' && localStorage.getItem('auth_id') == item.follower_id) {
                    image = (<Link to={"/post/" + post.id}><img src={"/uploads/posts/" + post.post} width="300px" height="300px" className="postsProfile" /></Link>);
                    video = (
                      <Link to={"/post/" + post.id}><video className="postsProfile" width="300px" height="300px" autoPlay loop muted>
                        <source src={"/uploads/videos/" + post.post} type="video/mp4" />
                      </video></Link> 
                    );

                    if(post.post.includes('.mp4') === true) {
                      block = video;
                    }else {
                      block = image;
                    }
       
        			return (
        			    <div key={post.id} className="postBg">
        			        {item.id}
        				    {block}
        			        
        			    </div>
        			)
        		    }else if (id === post.id_user && userProfile.is_private == 'true' && localStorage.getItem('auth_id') != item.follower_id) {
        		    	return (
                            <div key={post.id}>
                            	Закрытый аккаунт
                            </div>
        		    	)
        		    }else {
        		    image = (<Link to={"/post/" + post.id}><img src={"/uploads/posts/" + post.post} width="300px" height="300px" className="postsProfile" /></Link>);
                    video = (
                      <Link to={"/post/" + post.id}><video className="postsProfile" width="300px" height="300px" autoPlay loop muted>
                        <source src={"/uploads/videos/" + post.post} type="video/mp4" />
                      </video></Link> 
                    );

                    if(post.post.includes('.mp4') === true) {
                      block = video;
                    }else {
                      block = image;
                    }
       
        			return (
        			    <div key={post.id} className="postBg">
        				    {block}
        			    </div>
        			)
        		    }
        		})}
        		}
        		</div>)
            }
        	})
        	}
        </div>
        </div>
        </div>
    )
}

export default PostsUser;