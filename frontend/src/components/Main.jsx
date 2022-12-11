import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import '../css/style.css';
import {AiOutlineHeart, AiOutlineComment} from 'react-icons/ai';
import moment from 'moment';

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
  let img2 = '';
  let imageProfile2 = '';
  let video_profile = '';
  let blockProfiles = '';
  
  if(localStorage.getItem('auth_image') != 'default.jpg') img2 = 'profiles';
  else img2 = 'default';

  let viewMap = followers.map((item, index) => {
    if(localStorage.getItem('auth_id') == item.follower_id) {
      
      return (
        <div key={item.id}>
          {
            users.map((el, index) => {
              if(item.user_id === el.id) {
  
                if(el.image != 'default.jpg') img = 'profiles';
                else img = 'default';

                imageProfile2 = (<img src={"/uploads/" + img + "/" + el.image} className="avatarka" width="64px" height="64px" />);
                video_profile = (
                <video className="avatarka" width="64px" height="64px" autoPlay loop muted>
                  <source src={"/uploads/profiles/" + el.image} type="video/mp4" />
                </video>  
                );

                if(el.image.includes('.mp4') === true) {
                  blockProfiles = video_profile;
                }else {
                  blockProfiles = imageProfile2;
                }

                return (
                  <div key={el.id} className="block_list_users">
                    <div>
                    <Link to={"/profile/"+el.id}>{blockProfiles}</Link>
                    
                    <div className="block_followers_text2">
                      <Link to={"/profile/"+el.id}>
                        <div className="textToTheCenter">{el.username}</div>
                      </Link>
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
  });
  
  let profileImg = '';
  let profileImg2 = '';
  let profileImg3 = '';
  let image = '';
  let video = '';
  let block = '';
  let counterPosts = 0;
  const [liked, setLiked] = useState(false);
  let counterLikes = 0;
  let counterComments = 0;

  let imageProfile3 = '';
  let video_profile2 = '';
  let blockProfiles2 = '';

  
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
                          counterPosts++;

                          imageProfile3 = (<img src={"/uploads/" + profileImg + "/" + elem.image} className="avatarka" width="36px" height="36px" />);
                          video_profile2 = (
                          <video className="avatarka" width="36px" height="36px" autoPlay loop muted>
                            <source src={"/uploads/profiles/" + elem.image} type="video/mp4" />
                          </video>  
                          );
          
                          if(elem.image.includes('.mp4') === true) {
                            blockProfiles2 = video_profile2;
                          }else {
                            blockProfiles2 = imageProfile3;
                          }

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
                                  <Link to={"/profile/" + el.id_user}>{blockProfiles2}</Link>
                                  <Link to={"/profile/" + el.id_user}><div className="username-text-post">{elem.username}</div></Link>
                                  <span className="datetime"> • {moment(el.created_at).fromNow()}</span>
                                  </div>      
                                  <div className="postBgColor">{block}</div>
                                  <div className="block-icons-post">

                                  <Link to={"/post/" + el.id}><AiOutlineHeart className="icons" /></Link>                                
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

  let imageProfile = (<img src={"/uploads/" + img2 + "/" + localStorage.getItem('auth_image')} className="avatarka" width="64px" height="64px" />);
  let video2 = (
    <video className="avatarka" width="64px" height="64px" autoPlay loop muted>
      <source src={"/uploads/profiles/" + localStorage.getItem('auth_image')} type="video/mp4" />
    </video>  
  );
  let blockProfile = '';

  if(localStorage.getItem('auth_image').includes('.mp4') === true) {
    blockProfile = video2;
  }else {
    blockProfile = imageProfile;
  }

  return (
    <div className="main">
    <div>
      <div className="follow_users">
        <div className="marginleft25px">
        <Link to={"/profile/"+localStorage.getItem('auth_id')}>{blockProfile}</Link>
        <div>
          <Link to={"/profile/"+localStorage.getItem('auth_id')}>
            <div className="textToTheCenter">{localStorage.getItem('auth_name')}</div>
          </Link>
        </div>      
        </div>

        {viewMap}
      </div><br/>

      <div className="follow_posts">
        
        {counterPosts != 0 ? viewPosts : <div className="text-on-center">Подпишитесь на других, чтобы увидеть свежие посты в ленте.</div>}
        
      </div>
    </div>
    </div>
  );
  
}

export default Main;