import {react, useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import '../../css/style.css';
import moment from 'moment';
import {AiOutlineHeart} from 'react-icons/ai';

const Comment = (props) => {

  const {id} = useParams();
  const [textComment, setTextComment] = useState('');
  const [post, setPost] = useState({
    id_user: 0,
    post: '',
    description: '',
    created_at: '',
  });
  const [userProfile, setUser] = useState({
      username: '',
      bio: '',
      image: '',
  });
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);

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

  }, []);

  if(post.post.includes('.mp4') === true) {
    block = video;
  }else {
    block = image;
  }

  let profileImg = '';
  let profileImg2 = '';
  let likedOrNot = '';

  if(userProfile.image != 'default.jpg') profileImg = 'profiles';
  else profileImg = 'default';
  
  return (
    <div className="main">
      <div className="home_posts">
        <div>
          <div className="block-texts-username padding10">
            <Link to={"/profile/" + post.id_user}><img className="avatarka" width="36px" height="36px" src={'/uploads/' + profileImg + '/' + userProfile.image}  /></Link>
            <Link to={"/profile/" + post.id_user}><div className="username-text-post">{userProfile.username}</div></Link>
            <span className="datetime"> • {moment(post.created_at).fromNow()}</span>
          </div>

          {block}

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
          
          {users.map((u, i) => {
          if(post.id_user === u.id) {
          return (
          <div key={u.id} className="block-comments-profile padding10">
            <Link to={"/profile/" + post.id_user}><img className="avatarka" width="36px" height="36px" src={'/uploads/' + profileImg + '/' + u.image}  /></Link>
            <div className="block-comments">
              <Link to={"/profile/" + post.id_user}><div className="username-text-post">{u.username}</div></Link>
              <div className="commentText">{post.description}</div>
              <span className="datetime">{moment(post.created_at).fromNow()}</span>
            </div>
          </div>
          )}})}

          {comments.map((comment, index) => {
            if(id == comment.id_post) {
              
              return (
                <div key={comment.id}>
                  {
                    users.map((u, i) => {
                      if(u.id === comment.id_user) {
                        if(u.image != 'default.jpg') profileImg2 = 'profiles';
                        else profileImg2 = 'default';

                        return (
                          <div key={i} className="block-comments-out padding10">
                            <div className="block-comments-profile">
                              <Link to={"/profile/" + comment.id_user}><img className="avatarka" width="36px" height="36px" src={'/uploads/' + profileImg2 + '/' + u.image}  /></Link>
                              <div className="block-comments">
                                <Link to={"/profile/" + comment.id_user}><div className="username-text-post">{u.username}</div></Link>
                                <div className="commentText">{comment.text}</div>
                                <span className="datetime">{moment(comment.created_at).fromNow()}</span>
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
  );
}

export default Comment;