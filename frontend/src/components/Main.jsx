import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import '../css/style.css';
import {AiOutlineHeart, AiOutlineComment, AiOutlineBook} from 'react-icons/ai';
import moment from 'moment';
import Comment from './comments/Comment';

const Main = (props) => {
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [id, setId] = useState(0);

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

    axios.get(`http://localhost:8000/api/followers`).then( res => {
      if(res.data.status === 200)
      {
        setFollowers(res.data.followers);
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

  }, []);

  let img = '';

  let viewMap = followers.map((item, index) => {
    if(localStorage.getItem('auth_id') == item.follower_id) {
      
      return (
        <div key={item.id}>
          {
            users.map((el, index) => {
              if(item.user_id === el.id) {
                
                if(el.image != 'default.jpg') img = 'profiles';
                else img = 'default';

                return (
                  <div key={el.id} className="block_list_users">
                    <a href={"/profile/"+el.id}><img className="avatarka" width="48px" height="48px" src={'/uploads/' + img + '/' + el.image} /></a>
                    
                    <div className="block_followers_text2">
                      <Link to={"/profile/"+el.id}>
                        <div className="textToTheCenter">{el.username}</div>
                      </Link>
                    </div>
                  </div>
                )
              } 
            })
          }
        </div>
      )
    }
  });
 
  const [id_post, setIdPost] = useState(2);
  const [id_user, setIdUser] = useState(localStorage.getItem('auth_id'));
  const [like, setLike] = useState(1);

  let CryptoJS = require("crypto-js");
  let profileImg = '';
  let profileImg2 = '';
  let profileImg3 = '';
  let image = '';
  let video = '';
  let block = '';
  let counterLikes = 0;
  let likedOrNot = '';
  let counterComments = 0;
  const [liked, setLiked] = useState(false);
  
  const [userIDComment, setUserIDComment] = useState(0);

  let viewPosts = followers.map((item, index) => {
    if(localStorage.getItem('auth_id') == item.follower_id) {
      return (
        <div key={item.id}>
          {
            users.map((elem, index) => {
              if(item.user_id === elem.id) {

                if(elem.image != 'default.jpg') profileImg = 'profiles';
                else profileImg = 'default';

                return (
                  <div key={elem.id}>
                    {
                      posts.map((el, index) => {
                        if(elem.id === el.id_user) {

                            likedOrNot = likes.map((like, i) => { 

                                if(el.id === like.id_post) {
                                return (
                                <div key={like.id}>
                                  
                                  {localStorage.getItem('auth_id') == like.id_user ? <img src={"/uploads/"+like.liked} className="icons" onClick={(e) => {
                                    e.preventDefault();

                                    axios.delete(`http://localhost:8000/api/like-delete/${like.id}`).then( res => {
                                    if(res.data.status === 200)
                                    {
                                      window.location.reload();
                                    }
                                    });
                                  }}/> : <div>
                                  
                                  <AiOutlineHeart className="icons" onClick={(e) => {
                                  e.preventDefault();

                                  const formData = new FormData();
                                  formData.append('id_post', el.id);
                                  formData.append('id_user', localStorage.getItem('auth_id'));

                                  axios.post(`http://localhost:8000/api/likes`, formData).then( res => {
                                    if(res.data.status === 200)
                                    {
                                      window.location.reload();
                                    }
                                  })}} />
                                  </div>}
                                </div>
                                )
                                
                                }else if(localStorage.getItem('auth_id') != like.id_user){
                                  return (
                                    <div key={i}>
                                     <div>
                                      <AiOutlineHeart className="icons" onClick={(e) => {
                                      e.preventDefault();

                                      const formData = new FormData();
                                      formData.append('id_post', el.id);
                                      formData.append('id_user', localStorage.getItem('auth_id'));

                                      axios.post(`http://localhost:8000/api/likes`, formData).then( res => {
                                        if(res.data.status === 200)
                                        {
                                          window.location.reload();
                                        }
                                      })}} />
                                      </div>
                                    </div>
                                  )
                                }
                              })                          
                          
                
                          image = (<img src={"/uploads/posts/" + el.post} className="imagePost" />);
                          video = (
                            <video className="video_post" width="600px" height="600px" autoPlay loop controls muted>
                              <source src={"/uploads/videos/" + el.post} type="video/mp4" />
                            </video>  
                          );

                          if(el.post.includes('.mp4') === true) {
                            block = video;
                          }else {
                            block = image;
                          }

                          return (
                            <div key={el.id} className="home_posts">                               

                                <div>
                                  <div className="block-texts-username padding10">
                                  <Link to={"/profile/" + el.id_user}><img className="avatarka" width="36px" height="36px" src={'/uploads/' + profileImg + '/' + elem.image}  /></Link>
                                  <Link to={"/profile/" + el.id_user}><div className="username-text-post">{elem.username}</div></Link>
                                  <span className="datetime"> • {moment(el.created_at).fromNow()}</span>
                                  </div>      
                                  {block}
                                  <div className="block-icons-post">
                                  
                                  <span>
                                  
                                  {likedOrNot != '' ? likedOrNot
                                  : <AiOutlineHeart className="icons" onClick={(e) => {
                                      e.preventDefault();

                                      const formData = new FormData();
                                      formData.append('id_post', el.id);
                                      formData.append('id_user', localStorage.getItem('auth_id'));

                                      axios.post(`http://localhost:8000/api/likes`, formData).then( res => {
                                        if(res.data.status === 200)
                                        {
                                          window.location.reload();
                                        }
                                      })}} />}
                                  
                                  </span>
                                  <Link to={"/post/" + el.id}><AiOutlineComment className="icons" /></Link>
                                  </div> 
                                  
                                  <div className="PostDescription"><b>{elem.username}</b> {el.description}</div> 
                                </div>                  
                            </div>
                          )
                        }
                      })
                    }
                  </div>
                )
              }
            })
          }
        </div>
      )
    }
  });

  return (
    <div className="main">
    <div>
      <div className="follow_users">
        {viewMap}
      </div><br/>

      <div className="follow_posts">
        {viewPosts}
      </div>
    </div>
    </div>
  );
}

export default Main;