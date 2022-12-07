import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import Profile from '../Profile';

const LikesPost = (props) => {
  const {id} = useParams();
	const [posts, setPosts] = useState([]);
	const [likes, setLikes] = useState([]);
  const [user, setUser] = useState({
    likes: '',
  });

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

        axios.get(`http://localhost:8000/api/likes-get`).then( res => {
            if(res.data.status === 200)
            {
              setLikes(res.data.likes);
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
              console.log(404);
          }
        });
    }, [id]);

    const [blurPage, setBlurPage] = useState('');

    const handleBlurPost = () => {
      setBlurPage('blur');
    }

    const cancelBlur = () => {
      setBlurPage('');
    }

    let image = '';
    let video = '';
    let block = '';
    let counterPosts = 0;

    return (
    	<div>

      {posts.map((post, i) => {
        if(post.id_user == id) {
          counterPosts++;
        }
      })}

      <Profile counterPosts={counterPosts} cancelBlur={cancelBlur} handleBlurPost={handleBlurPost} />

    	  <div className="block-switch-posts">
    	      <div className="block-switch">
              <Link to={"/profile/" + id}><span className="element">POSTS</span></Link>
              <Link to={"/profile/" + id + "/likes"}><span className="element active">LIKES</span></Link>
            </div>
        </div>

    	  <div className="block-center">
        <div className="block-posts-profile">
        	{user.likes === 'true' && localStorage.getItem('auth_id') != id ? 
          <div>Пользователь скрыл показ пролайканных постов.</div> :
            likes.map((like, i) => {
              if(like.id_user == id) {
                return (
                  <div key={i}>
                    {posts.map((post, i) => {
                      if(like.id_post === post.id) {
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
                            <Link to={"/post/" + post.id}>{block}</Link>
                          </div>
                        )
                      }
                    })}
                  </div>
                )
              }
            })
          }
        </div>
        </div>
        </div>
    )
}

export default LikesPost;