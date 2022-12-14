import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import '../css/style.css';
import {AiOutlineHeart, AiOutlineComment, AiOutlineUserAdd} from 'react-icons/ai';
import moment from 'moment';

const Notification = (props) => {

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {

  	axios.get(`http://localhost:8000/api/users`).then( res => {
      if(res.data.status === 200)
      {
        setUsers(res.data.users);
      }
      else if(res.data.status === 404)
      {
        console.log(404);
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

    axios.get(`http://localhost:8000/api/followers/`).then( res => {
      if(res.data.status === 200)
      {
        setFollowers(res.data.followers);
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

  let image = '';
  let video = '';
  let block = '';
  let text = '';
  let img ='';

  let counterFollowers = 0;
  let counterLikes = 0;
  let counterComments = 0;

  let imageUser = '';
  let video_user = '';
  let blockProfiles = '';

  let viewFollowers = followers.map((follower, i) => {
    if(localStorage.getItem('auth_id') == follower.user_id) {
      return (
        <div key={follower.id}>
          {
            users.map((user, i) => {
              if(follower.follower_id === user.id) {
                counterFollowers++;

                if(user.image != 'default.jpg') img = 'profiles';
                else img = 'default';  

                imageUser = (<img src={'/uploads/' + img + '/' + user.image} width="36px" height="36px" className="avatarka" />);
                video_user = (
                <video className="avatarka" width="36px" height="36px" autoPlay loop muted>
                  <source src={'/uploads/' + img + '/' + user.image} type="video/mp4" />
                </video>  
                ); 
              
                if(user.image.includes('.mp4') === true) {
                  blockProfiles = video_user;
                }else {
                  blockProfiles = imageUser;
                }
                
                return (
                  <div key={user.id}>
                    
                      {follower.is_private === 'true' ? 
                      <div className="block-notification-flex not_padding">
                      <a href={"/profile/" + user.id}>
                      {blockProfiles}
                      </a>
                      <div className="block-username-notification">
                        <a href={"/profile/" + user.id}>
                        <div className="username-text-post">{user.username}</div>
                        <span className="space10px">?????????? ?????????????????????? ???? ??????</span>
                        <span className="datetime">{moment(follower.created_at).fromNow()}</span>
                        </a>
                        <button className="btnAccess btn-primary" onClick={(e) => {
                        e.preventDefault();

                        const formData = new FormData();
                        formData.append('follower_id', user.id);
                        formData.append('user_id', localStorage.getItem('auth_id'));
                        formData.append('is_private', 'false');
                    
                        axios.post(`http://localhost:8000/api/request-follow/${follower.id}`, formData).then(res => {
                            if(res.data.status === 200) {
                              window.location.reload();
                            }
                            else {
                              swal('???????????? ???????????????????????? ???? ????????????.', "", 'error');
                            }
                        });
                      }}>??????????????</button>
                      <button className="btnAccess btn-danger" onClick={(e) => {
                        e.preventDefault();

                        axios.delete(`http://localhost:8000/api/unfollow/${follower.id}`).then( res => {
                          if(res.data.status === 200)
                          {
                            window.location.reload();
                          }
                        });
                      }}>????????????</button>
                      </div>
                      </div>
                      : <div></div>
                      }
                      {follower.is_private === 'false' ?
                      <a href={"/profile/" + user.id} className="block-notification-flex not_padding">
                      {blockProfiles}
                      <div className="block-username-notification">
                        <div className="username-text-post">{user.username}</div>
                        <span className="space10px">????????????????????(-??????) ???? ???????? ????????????????????.</span>
                        <span className="datetime">{moment(follower.created_at).fromNow()}</span>
                      </div>
                      </a> : <div></div>
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

  let viewLikesPosts = posts.map((post, i) => {
    if(post.id_user == localStorage.getItem('auth_id')) {
      return (
        <div key={post.id}>
          {
            likes.map((like, i) => {
              if(like.id_post === post.id) {
                return (
                  <div key={like.id}>
                    {
                      users.map((user, i) => {
                        if(like.id_user === user.id && user.id != localStorage.getItem('auth_id')) {
                          counterLikes++;
                          image = (<a href={"/post/" + post.id}><img src={"/uploads/posts/" + post.post} className="not_post" /></a>);
                          video = (
                            <a href={"/post/" + post.id}>
                            <video className="not_post" width="600px" height="600px" autoPlay loop muted>
                              <source src={"/uploads/videos/" + post.post} type="video/mp4" />
                            </video>  
                            </a>
                          );

                          if(post.post.includes('.mp4') === true) {
                            block = video;
                            text = '??????????';
                          }else {
                            block = image;
                            text = '????????????????????';
                          }

                          imageUser = (<img src={'/uploads/' + img + '/' + user.image} width="36px" height="36px" className="avatarka" />);
                          video_user = (
                          <video className="avatarka" width="36px" height="36px" autoPlay loop muted>
                            <source src={'/uploads/' + img + '/' + user.image} type="video/mp4" />
                          </video>  
                          ); 
                        
                          if(user.image.includes('.mp4') === true) {
                            blockProfiles = video_user;
                          }else {
                            blockProfiles = imageUser;
                          }

                          return (
                            <div key={user.id}>
                              <a href={"/profile/" + user.id} className="block-notification-flex not_padding">
                              {blockProfiles}
                              <div className="block-username-notification">
                                <div className="username-text-post">{user.username}</div>
                                <span className="space10px">???????????????? ???????? {text}.</span>
                                <span className="datetime">{moment(like.created_at).fromNow()}</span>
                              </div>
                              <div className="notification-post">{block}</div>
                              </a>
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

  let viewComments = posts.map((post, i) => {
    if(post.id_user == localStorage.getItem('auth_id')) {
      return (
        <div key={post.id}>
          {
            comments.map((comment, i) => {
              if(comment.id_post === post.id) {
                return (
                  <div key={comment.id}>
                    {
                      users.map((user, i) => {
                        if(comment.id_user === user.id && user.id != localStorage.getItem('auth_id')) {
                          counterComments++;
                          image = (<a href={"/post/" + post.id}><img src={"/uploads/posts/" + post.post} className="not_post" /></a>);
                          video = (
                            <a href={"/post/" + post.id}>
                            <video className="not_post" width="600px" height="600px" autoPlay loop muted>
                              <source src={"/uploads/videos/" + post.post} type="video/mp4" />
                            </video>  
                            </a>
                          );

                          if(post.post.includes('.mp4') === true) {
                            block = video;
                            text = '??????????';
                          }else {
                            block = image;
                            text = '????????????????????';
                          }

                          imageUser = (<img src={'/uploads/' + img + '/' + user.image} width="36px" height="36px" className="avatarka" />);
                          video_user = (
                          <video className="avatarka" width="36px" height="36px" autoPlay loop muted>
                            <source src={'/uploads/' + img + '/' + user.image} type="video/mp4" />
                          </video>  
                          ); 
                        
                          if(user.image.includes('.mp4') === true) {
                            blockProfiles = video_user;
                          }else {
                            blockProfiles = imageUser;
                          }

                          return (
                            <div key={user.id}>
                              <a href={"/profile/" + user.id} className="block-notification-flex not_padding">
                              {blockProfiles}
                              <div className="block-username-notification">
                                <div className="username-text-post">{user.username}</div>
                                <span className="space10px">?????????????????????????????? ???????? {text}:</span>
                                <span className="space10px">{comment.text}</span>
                                <span className="datetime">{moment(comment.created_at).fromNow()}</span>
                              </div>
                              <div className="notification-post">{block}</div>
                              </a>
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

  const [folBool, setFolBool] = useState(true);
  const [likeBool, setLikeBool] = useState(false);
  const [comBool, setComBool] = useState(false);

  return (
    <div>
      <div className="block-center">
      <div>
      <div className="block-notification">
        <div onClick={props.cancel} className="xcancel">??</div>
        <div className="text_subs"><h4>??????????????????????</h4></div>
        <hr/>
          <div className="block-switch-notification">
            <span onClick={() => {setFolBool(true); setLikeBool(false); setComBool(false)}} ><AiOutlineUserAdd className="icons" /></span>
            <span onClick={() => {setFolBool(false); setLikeBool(true); setComBool(false)}} ><AiOutlineHeart className="icons" /></span>
            <span onClick={() => {setFolBool(false); setLikeBool(false); setComBool(true)}} ><AiOutlineComment className="icons" /></span>
          </div>
        <hr/>
        <div>
          {folBool != false ? viewFollowers : <div></div>}
          {likeBool != false ? viewLikesPosts : <div></div>}
          {comBool != false ? viewComments : <div></div>}
        </div>
      </div>
      </div>
      </div>
    </div>
  );
  
}

export default Notification;