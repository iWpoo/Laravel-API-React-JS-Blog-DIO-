import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import '../css/style.css';
import {AiOutlineHeart, AiOutlineComment, AiOutlineBook} from 'react-icons/ai';
import moment from 'moment';


const Main = () => {
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

    axios.get(`http://localhost:8000/api/comments-get`).then( res => {
      if(res.data.status === 200)
      {
        setComments(res.data.comments);
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
  let image = '';
  let video = '';
  let block = '';
  let counterLikes = 0;
  let likedOrNot = '';
  const [liked, setLiked] = useState(false);

  const [textComment, setTextComment] = useState('');
  const [blockOrNone, setBlockOrNone] = useState('disappear');
  const [blur, setBlur] = useState('');

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
                                  <div className="block-center">
                                  <div className={blockOrNone}>
                                  <div className="block-followers">
                                    <div>
                                      {comments.map((comment, index) => {
                                        if(id === comment.id_post) {
                                          return (
                                            <div key={comment.id}>
                                              {
                                                users.map((user, i) => {
                                                  if(user.id === comment.id_user) {
                                                    if(user.image != 'default.jpg') profileImg2 = 'profiles';
                                                    else profileImg2 = 'default';

                                                    return (
                                                      <div key={i}>
                                                        <div className="block-texts-username2 padding10">
                                                        <Link to={"/profile/" + comment.id_user}><img className="avatarka" width="36px" height="36px" src={'/uploads/' + profileImg2 + '/' + user.image}  /></Link>
                                                        
                                                        <div className="block-texts-username">
                                                        <Link to={"/profile/" + comment.id_user}><div className="username-text-post">{user.username}</div></Link>
                                                        <div className="commentText">{comment.text}</div><br/>
                                                        
                                                          <span className="datetime">{moment(comment.created_at).fromNow()}</span>
                                                        </div>
                                                        </div>
                                                      </div>
                                                    )
                                                  }
                                                })}
                                              
                                            </div>

                                          )
                                          
                                        }
                                      })}
                                    </div>
                                    <form method="post" className="form_comment">
                                      <input type="text" onChange={(e) => setTextComment(e.target.value)} value={textComment} className="input_comment" placeholder="Добавить комментарий..." />
                                      <button onClick={(e) => {
                                        e.preventDefault();

                                        const formData = new FormData();
                                        formData.append('id_user', localStorage.getItem('auth_id'));
                                        formData.append('id_post', id);
                                        formData.append('text', textComment);

                                        axios.post(`http://localhost:8000/api/comment-add`, formData).then( res => {
                                          if(res.data.status === 200)
                                          {
                                            window.location.reload();
                                          }
                                        });   
                                      }} className="postComment" disabled={textComment.length >= 1 ? false : true}>Post</button>
                                    </form>
                                  </div>
                                  </div>
                                  </div>
                                </div>

                                <div className={blur}>
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
                                  <AiOutlineComment className="icons" onClick={(e) => {
                                    e.preventDefault();
                                    
                                    setBlockOrNone('');
                                    setBlur('blur');
                                    setId(el.id);
                                  }} />
                                  </div>  
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
      <div className={"follow_users " + blur}>
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