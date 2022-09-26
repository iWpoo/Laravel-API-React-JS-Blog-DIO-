import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import '../css/auth.css';
import axios from 'axios';

const EditProfile = () => {
  const history = useNavigate();
  const [token, setToken] = useState('');
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [site, setSite] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [picture, setPicture] = useState([]);

  useEffect(() => {
      axios.get(`http://localhost:8000/api/profile/`+localStorage.getItem('auth_id')).then( res => {

          if(res.data.status === 200)
          {
              setToken(res.data.user.token);
          }
          else if(res.data.status === 404)
          {
              history('/');
          }
      });

  }, []);

  useEffect(() => {
      axios.get(`http://localhost:8000/api/profile/`+localStorage.getItem('auth_id')).then( res => {

          if(res.data.status === 200)
          {
              setId(res.data.user.id);
              setUsername(res.data.user.username);
              setName(res.data.user.name);
              setEmail(res.data.user.email);
              setPhone(res.data.user.phone);
              setSite(res.data.user.site);
              setBio(res.data.user.bio);
              setImage(res.data.user.image);
          }
          else if(res.data.status === 404)
          {
              history('/');
          }
      });

  }, []);

  const [errors, setErrors] = useState('');

  const handleSubmit = (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append('image', picture.image);
      formData.append('username', username);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('site', site);
      formData.append('phone', phone);
      formData.append('bio', bio);

      axios.post(`/api/edit-profile/${localStorage.getItem('auth_id')}`, formData).then(res => {
          if(res.data.status === 200) {
              localStorage.setItem('auth_name', res.data.username);
              localStorage.setItem('auth_image', res.data.image);
              localStorage.setItem('auth_id', res.data.id);
              history('/profile/'+localStorage.getItem('auth_id'));
          }
          else if(res.data.status === 422) {
              setErrors(res.data.validate_err);
          }
      });
  }

  const [img, setImg] = useState('default.jpg');

  const delImg = (e) => {
    e.preventDefault();

    const formData2 = new FormData();
    formData2.append('image', img);

    axios.post(`/api/delete-profile-img/${localStorage.getItem('auth_id')}`, formData2).then(res => {
        if(res.data.status === 200) {
            localStorage.setItem('auth_image', res.data.image);
            window.location.reload();
        }
        else {
          console.log('Не удалось удалить изображение.');
        }
    });
  }

  useEffect(() => {
    if(site === 'null' || phone === 'null') {
      setSite('');
      setPhone('');
    }
  });

  let CryptoJS = require("crypto-js");
  const tk = token;
  let dtk = CryptoJS.AES.decrypt(tk, 'my-secret-token');

  const [isImg, setIsImg] = useState(true);
  const [text, setText] = useState(token);
  useEffect(() => {
    if(image == 'default.jpg') {
        setIsImg(false);
    }
  });

if(localStorage.getItem('auth_token') === dtk.toString(CryptoJS.enc.Utf8)) {
  return (
    <div>
    <div>{errors}</div>
    <form method="post" encType="multipart/form-data">
    {isImg == true ? <img src={'/uploads/profiles/'+image} width="128" height="128" /> :
    <img src={'/uploads/default/'+image} width="128" height="128" />}<br/>
    <input type="file" name="image" onChange={(e) => setPicture({image: e.target.files[0]})} /><br/>
    <button onClick={delImg} type="submit">Удалить изображение</button><br/>
        <input type="text" onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Username" /><br/>
        <input type="text" onChange={(e) => setName(e.target.value)}  value={name} placeholder="Name" /><br/>
        <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" /><br/>
        <input type="text" onChange={(e) => setSite(e.target.value)}  value={site} placeholder="Site" /><br/>
        <input type="text" onChange={(e) => setPhone(e.target.value)} value={phone} placeholder="Phone" /><br/>
        <textarea onChange={(e) => setBio(e.target.value)} placeholder="Bio" value={bio}></textarea><br/>
        <button onClick={handleSubmit} type="submit">Редактировать</button>
    </form>
    </div>
  );
} else {
  history('/');
}

}

export default EditProfile;
