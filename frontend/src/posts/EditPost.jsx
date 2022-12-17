import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import '../css/style.css';
import '../css/auth.css';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import {AiFillFileImage} from 'react-icons/ai';
import swal from 'sweetalert';

const EditPost = (props) => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [userProfile, setUser] = useState({
    token: '',
  });

  let CryptoJS = require("crypto-js");
  const tk = userProfile.token;
  let dtk = CryptoJS.AES.decrypt(tk, 'my-secret-token');


  // Getting information about the users

  useEffect(() => {
      axios.get(`http://localhost:8000/api/profile/${localStorage.getItem('auth_id')}`).then( res => {
          if(res.data.status === 200)
          {
              setUser(res.data.user);
          }
          else if(res.data.status === 404)
          {
              history('/');
          }
      });

      axios.get(`http://localhost:8000/api/post/${id}`).then( res => {
          if(res.data.status === 200)
          {
              setDescription(res.data.post.description);
          }
          else if(res.data.status === 404)
          {
              history('/');
          }
      });

  }, [id]);

  const [disable, setDisable] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true);

    const formData = new FormData();
    formData.append('description', description);

    axios.post(`http://localhost:8000/api/edit-posts/${id}`, formData).then(res => {
        if(res.data.status === 200) {
          window.location.reload();
        }
        else {
          swal('Не удалось редактировать пост.', "", 'error');
        }
    });
  } 

  const [path, setPath] = useState('/uploads/profiles/');

  useEffect(() => {           
    if(localStorage.getItem('auth_image') != 'default.jpg') {
      setPath('/uploads/profiles/');
    }else {
      setPath('/uploads/default/');
    }
  })

  let imageProfile = (<img src={path + localStorage.getItem('auth_image')} className="image-edit-profile" />);
  let video_profile = (
  <video className="image-edit-profile" autoPlay loop muted>
    <source src={"/uploads/profiles/" + localStorage.getItem('auth_image')} type="video/mp4" />
  </video>  
  );  
  let blockProfiles = '';

  if(localStorage.getItem('auth_image').includes('.mp4') === true) {
    blockProfiles = video_profile;
  }else {
    blockProfiles = imageProfile;
  }

  
    return (
      <div className="blockEditPost">
      <button className="cancel" onClick={props.cancel}>Отмена</button>
      <div className="borderAddPost">
      <div className="textWithUnderline">Редактировать описание</div><br/>
      <form onSubmit={handleSubmit} method="post">
          <div className="formAddPost">
          <div className="block-texts">
          {blockProfiles}
          <div className="block-username">
          <span className="username-text">{localStorage.getItem('auth_name')}</span>
          </div>
          </div><br/>
          <textarea className="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Добавить описание..."></textarea><br/>
          <button type="submit" className="btnAuth" disabled={disable} >Редактировать</button>
          </div>
      </form><br/>
      </div>
      </div>
    );
}

export default EditPost;