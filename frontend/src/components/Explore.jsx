import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import '../css/style.css';
import {AiOutlineHeart, AiOutlineComment, AiOutlineBook} from 'react-icons/ai';
import moment from 'moment';

const Explore = (props) => {

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {

  	axios.get(`http://localhost:8000/api/users`).then( res => {
          if(res.data.status === 200)
          {
            setUsers(res.data.users);
          }
          else if(res.data.status === 404)
          {
            history('/');
          }
      });

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

  }, []);

  let image = '';
  let video = '';
  let block = '';
  
  let viewPosts = posts.map((post, i) => {
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
                      <Link to={"/post/" + post.id}><div className="block-posts">{block}</div></Link>
                    }
                  </div>
                )
            });

  return (
    <div>
      {viewPosts}
    </div>
  );
  
}

export default Explore;