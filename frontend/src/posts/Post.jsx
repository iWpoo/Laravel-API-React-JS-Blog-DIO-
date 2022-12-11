import {react, useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import '../css/style.css';
import moment from 'moment';
import {AiOutlineHeart, AiOutlineEllipsis} from 'react-icons/ai';
import EditPost from './EditPost';

const Post = (props) => {
  const navigate = useNavigate();
  const {id} = useParams();
  let CryptoJS = require("crypto-js");

  const [token, setToken] = useState(''); 
  const [idUserComment, setIdUserComment] = useState(0);
  
  useEffect(() => {
    axios.get(`http://localhost:8000/api/profile/${localStorage.getItem('auth_id')}`).then( res => {
      if(res.data.status === 200)
      {
        setToken(res.data.user.token);
        setIdUserComment(res.data.user.id);
      }
      else if(res.data.status === 404)
      {
        console.log(404);
      }
    });
  }, [])

  let tok = token;
  let dtok = CryptoJS.AES.decrypt(tok, 'my-secret-token');

  const [textComment, setTextComment] = useState('');
  const [post, setPost] = useState({
    id: 0,
    id_user: 0,
    post: '',
    description: '',
    created_at: '',
  });
  const [userProfile, setUser] = useState({
      id: 0,
      username: '',
      bio: '',
      image: '',
      token: '',
  });
  let tk = userProfile.token;
  let dtk = CryptoJS.AES.decrypt(tk, 'my-secret-token');

  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [likes, setLikes] = useState([]);
  const [like, setLike] = useState({
    id: 1,
    id_user: 1,
    id_post: 1,
  });

  let block = '';
  let image = (<img src={"/uploads/posts/" + post.post} className="imagePost" />);
  let video = (
    <video className="video_post" width="600px" height="600px" autoPlay loop controls muted>
      <source src={"/uploads/videos/" + post.post} type="video/mp4" />
    </video> 
  );

  useEffect(() => {
    axios.get(`http://localhost:8000/api/post/${id}`).then( res => {
      if(res.data.status === 200)
      {
        setPost(res.data.post);

        axios.get(`http://localhost:8000/api/profile/${res.data.post.id_user}`).then( res => {
          if(res.data.status === 200)
          {
            setUser(res.data.user);
          }
          else if(res.data.status === 404)
          {
            console.log(404);
          }
        });
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


  }, [id]);

  let bool = false;
  const [liked, setLiked] = useState();
  let idLike = 0;

  let viewLikes = likes.map((like, i) => {
    if(id == like.id_post && localStorage.getItem('auth_id') == like.id_user) {
      bool = true;
      idLike = like.id;       
    } 
  });

  useEffect(() => {
    if(bool === true) {
      setLiked(<img src="/uploads/like.png" className="icons" onClick={(e) => {
        e.preventDefault();
                          
        axios.delete(`http://localhost:8000/api/like-delete/${idLike}`).then( res => {
        if(res.data.status === 200)
        {
          window.location.reload();
        }
        });
      }}/>);
    }else {
      setLiked(<AiOutlineHeart className="icons" onClick={(e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id_post', id);
        formData.append('id_user', localStorage.getItem('auth_id'));

        axios.post(`http://localhost:8000/api/likes`, formData).then( res => {
          if(res.data.status === 200)
          {
            window.location.reload();
          }
        })}}
      />);
    }
  }, [bool, idLike])


  if(post.post.includes('.mp4') === true) {
    block = video;
  }else {
    block = image;
  }

  let profileImg = '';
  let profileImg2 = '';
  let likedOrNot = '';
  let counterLikes = 0;
  let disabledPost = false;

  if(userProfile.image != 'default.jpg') profileImg = 'profiles';
  else profileImg = 'default';

  const [clsName, setClsName] = useState('disappear');
  const [clsEdit, setClsEdit] = useState('disappear');
  const [blur, setBlur] = useState('');

  const handleEditPost = () => {
    cancel();
    setBlur('blur');
    setClsEdit('');
  }

  const openSettings = () => {
    setClsName('');
    setBlur('blur');
  }

  const cancel = () => {
    setClsName('disappear');
    setClsEdit('disappear');
    setBlur('');
  }

  const handleDeletePost = (e) => {
    e.preventDefault();

    axios.delete(`http://localhost:8000/api/delete-posts/${id}`).then( res => {
      if(res.data.status === 200)
      {
        navigate('/');  
      }
    })
  }

  let imageProfile = (<img src={"/uploads/" + profileImg + "/" + userProfile.image} className="avatarka" width="36px" height="36px" />);
  let video_profile = (
  <video className="avatarka" width="36px" height="36px" autoPlay loop muted>
    <source src={"/uploads/profiles/" + userProfile.image} type="video/mp4" />
  </video>  
  );
  let blockProfiles = '';
          
  if(userProfile.image.includes('.mp4') === true) {
    blockProfiles = video_profile;
  }else {
    blockProfiles = imageProfile;
  }

  let imageProfile2 = '';
  let video_profile2 = '';
  let blockProfiles2 = '';

  return (
    <div className="main">

      <div className={clsEdit}><EditPost cancel={cancel} /></div>

      <div className="block-center">
      <div className={clsName}>
      <div className="block-settings-ellipsis">
        <div><br/>
          <div onClick={handleEditPost} className="text-settings">Редактировать</div>
          <hr/>
          <div onClick={handleDeletePost} className="text-settings text-danger">Удалить</div>
          <hr/>
          <div onClick={cancel} className="text-settings">Отмена</div>
        </div>
      </div>
      </div>
      </div>
      
      <div>
      <div className="home_posts">
        <div className={blur}>
          <div className="block-to-settings">
          <div className="block-texts-username padding10">
            <Link to={"/profile/" + post.id_user}>{blockProfiles}</Link>
            <Link to={"/profile/" + post.id_user}><div className="username-text-post">{userProfile.username}</div></Link>
            <span className="datetime"> • {moment(post.created_at).fromNow()}</span>
          </div>
          <div>
            {dtk.toString(CryptoJS.enc.Utf8) == localStorage.getItem('auth_token') ? <div className="threedots" onClick={openSettings}><AiOutlineEllipsis className="icons" /></div> : <div></div>}
          </div>
          </div>
          
          <div onClick={cancel}>
          {block}

          {likes.map((like, i) => {
            if(like.id_post == id) {
              counterLikes++;
            }
          })}

          <div className="margintop15px">
          {liked}
          <span className="counterLikes"><b>{counterLikes} likes</b></span>
          </div> 

          <form method="post" className="form_comment">
            <input type="text" onChange={(e) => setTextComment(e.target.value)} value={textComment} className="input_comment" placeholder="Добавить комментарий..." />
            <button onClick={(e) => {
              e.preventDefault();
              disabledPost = true;

              const formData = new FormData();
              formData.append('id_user', idUserComment);
              formData.append('id_post', id);
              formData.append('text', textComment);

              axios.post(`http://localhost:8000/api/comment-add`, formData).then( res => {
                if(res.data.status === 200)
                {
                  window.location.reload();
                }
              });   
            }} className="postComment" disabled={textComment.length >= 1 ? disabledPost : true}>Post</button>
          </form> 

          <div className="block-comments-profile padding10">
            <Link to={"/profile/" + post.id_user}>{blockProfiles}</Link>
            <div className="block-comments">
              <Link to={"/profile/" + post.id_user}><div className="username-text-post">{userProfile.username}</div></Link>
              <div className="commentText">{post.description}</div>
              <span className="datetime">{moment(post.created_at).fromNow()}</span>
            </div>
          </div>

          {comments.map((comment, index) => {
            if(id == comment.id_post) {
              
              return (
                <div key={comment.id}>
                  {
                    users.map((u, i) => {
                      if(u.id === comment.id_user) {
                        if(u.image != 'default.jpg') profileImg2 = 'profiles';
                        else profileImg2 = 'default';

                        imageProfile2 = (<img src={"/uploads/" + profileImg2 + "/" + u.image} className="avatarka" width="36px" height="36px" />);
                        video_profile2 = (
                        <video className="avatarka" width="36px" height="36px" autoPlay loop muted>
                          <source src={"/uploads/profiles/" + u.image} type="video/mp4" />
                        </video>  
                        );  

                        if(u.image.includes('.mp4') === true) {
                          blockProfiles2 = video_profile2;
                        }else {
                          blockProfiles2 = imageProfile2;
                        }

                        if(u.image != 'default.jpg') profileImg2 = 'profiles';
                        else profileImg2 = 'default';

                        return (
                          <div key={i} className="block-comments-out padding10">
                            <div className="block-comments-profile block-to-settings">
                              <Link to={"/profile/" + comment.id_user}>{blockProfiles2}</Link>
                              <div className="block-comments">
                                <Link to={"/profile/" + comment.id_user}><div className="username-text-post">{u.username}</div></Link>
                                <div className="commentText">{comment.text}</div>
                                <div>
                                  <span className="datetime">{moment(comment.created_at).fromNow()}</span>
                                  {localStorage.getItem('auth_id') == comment.id_user ? <span onClick={(e) => {
                                    e.preventDefault();

                                    axios.delete(`http://localhost:8000/api/comment-delete/${comment.id}`).then( res => {
                                      if(res.data.status === 200)
                                      {
                                        window.location.reload();  
                                      }
                                    })
                                  }} className="datetime">Удалить</span> : <span></span>}
                                </div>
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
          })}

        </div>                              
      </div>
      </div>
      </div>
    </div>
  );
}

export default Post;