import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import '../css/style.css';
import '../css/auth.css';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import {AiFillFileImage} from 'react-icons/ai';
import swal from 'sweetalert';

const AddPost = (props) => {
  const navigate = useNavigate();
  const [id_user, setIdUser] = useState(localStorage.getItem('auth_id'));
  const [post, setPost] = useState('');
  const [picture, setPicture] = useState([]);
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

  }, [localStorage.getItem('auth_id')]);

  const [disable, setDisable] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true);

    const formData = new FormData();
    formData.append('id_user', id_user);
    formData.append('post', picture.post);
    formData.append('description', description);

    axios.post('http://localhost:8000/api/add-posts', formData).then(res => {
        if(res.data.status === 200) {
          window.location.reload();
        }
        else {
          swal('Не удалось добавить новый пост.', "", 'error');
        }
    });
  } 

  const [clsName, setClsName] = useState('disappear');
  const [clsName2, setClsName2] = useState('');
  const [path, setPath] = useState('/uploads/profiles/');

  useEffect(() => {           
    if(picture.post != undefined) {
      setClsName('');
      setClsName2('disappear');
    }

    if(localStorage.getItem('auth_image') != 'default.jpg') {
      setPath('/uploads/profiles/');
    }else {
      setPath('/uploads/default/');
    }
  })

  let imageProfile = (<img src={path + localStorage.getItem('auth_image')} className={"image-edit-profile " + clsName} />);
  let video_profile = (
  <video className={"image-edit-profile " + clsName} autoPlay loop muted>
    <source src={"/uploads/profiles/" + localStorage.getItem('auth_image')} type="video/mp4" />
  </video>  
  );  
  let blockProfiles = '';

  if(localStorage.getItem('auth_image').includes('.mp4') === true) {
    blockProfiles = video_profile;
  }else {
    blockProfiles = imageProfile;
  }

  
  if(localStorage.getItem('auth_token') != dtk.toString(CryptoJS.enc.Utf8)) {
    return (
      <div className="blockAddPost">
      <button className="cancel" onClick={props.cancel}>Отмена</button>
      <div className="borderAddPost">
      <div className="textWithUnderline">Создать новый пост</div><br/>
      <h3 align="center">Ошибка 404</h3><br/>
      </div>
      </div>
    );
  } else {
    return (
      <div className="blockAddPost">
      <button className="cancel" onClick={props.cancel}>Отмена</button>
      <div className="borderAddPost">
      <div className="textWithUnderline">Создать новый пост</div><br/>
      <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
          <label htmlFor="post" className={"forFile " + clsName2}>
            <AiFillFileImage className="Plus" /><br/><br/>
            <span className="AddPictureBtn">Выбрать файл</span>
          </label>
          <input type="file" className="disappear" id="post" name="post" onChange={(e) => setPicture({post: e.target.files[0]})} />

          <div className="formAddPost">
          <div className="block-texts">
          {blockProfiles}
          <div className="block-username">
          <span className={"username-text " + clsName}>{localStorage.getItem('auth_name')}</span>
          </div>
          </div><br/>
          <textarea className={"description " + clsName} name="description" onChange={(e) => setDescription(e.target.value)} placeholder="Добавить описание..."></textarea><br/>
          <button type="submit" className={"btnAuth " + clsName} disabled={disable} >Опубликовать</button>
          </div>
      </form><br/>
      </div>
      </div>
    );
  }
}

export default AddPost;