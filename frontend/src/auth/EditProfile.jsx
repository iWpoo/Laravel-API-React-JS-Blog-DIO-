import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import '../css/auth.css';
import axios from 'axios';
import swal from 'sweetalert';

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

  }, [localStorage.getItem('auth_id')]);

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
              console.log(404);
          }
      });

  }, [localStorage.getItem('auth_id')]);

  const [errors, setErrors] = useState('');

  const handleSubmit = (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append('username', username);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('site', site);
      formData.append('phone', phone);
      formData.append('bio', bio);

      axios.post(`/api/edit-profile/${localStorage.getItem('auth_id')}`, formData).then(res => {
          if(res.data.status === 200) {
              localStorage.setItem('auth_name', res.data.username);
              localStorage.setItem('auth_id', res.data.id);
              swal(res.data.message, "", 'success');
          }
          else if(res.data.status === 422) {
              setErrors(res.data.validate_err);
              swal(res.data.validation_err, "", 'error');
          }
      });
  }

  const [flip, setFlip] = useState(false);

  const handleChangeImage = () => {
    setFlip(true);
  }

  useEffect(() => {
    if(flip == true) {
      const formData = new FormData();
      formData.append('image', picture.image);

      axios.post(`http://localhost:8000/api/edit-image/${localStorage.getItem('auth_id')}`, formData).then(res => {
          if(res.data.status === 200) {
              localStorage.setItem('auth_image', res.data.image);
              setFlip(false);
              window.location.reload();
          }
          else if(res.data.status === 422) {
              swal(res.data.validation_err, "", 'error');
              setFlip(false);
          }else {
            swal("Error image", "", 'error');
            setFlip(false);
          }
      });
    }
  });

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
          swal('???? ?????????????? ?????????????? ??????????????????????.', "", 'error');
        }
    });
  }

  useEffect(() => {
    if(site === 'null' || phone === 'null' || bio === 'null') {
      setSite('');
      setPhone('');
      setBio('');
    }
  });

  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    if(username.length >= 3 && name.length >= 3) {
      setDisabled(false);
    }else {
      setDisabled(true);
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

  let block = '';

  let imageProfile = (<img src={"/uploads/profiles/" + image} className="image-edit-profile" />);
  let video = (
    <video className="image-edit-profile" autoPlay loop muted>
      <source src={"/uploads/profiles/" + image} type="video/mp4" />
    </video>  
  );
  
  if(image.includes('.mp4') === true) {
    block = video;
  }else {
    block = imageProfile;
  }
  
  if(localStorage.getItem('auth_token') === dtk.toString(CryptoJS.enc.Utf8)) {
  return (
    <div className="block-edit-profile">
    <div className="block-switch-elements">
      <div className="li-list"><br/>
        <Link to="/accounts/edit/"><div className="li-text active">?????????????????????????? ??????????????</div></Link><br/><br/>
        <Link to="/accounts/password/change/"><div className="li-text">?????????????? ????????????</div></Link><br/><br/>
        <Link to="/accounts/privacy_and_security/"><div className="li-text">???????????????????????????????????? ?? ????????????????????????</div></Link><br/><br/>
      </div>
    </div>

    <form method="post" encType="multipart/form-data" className="form-edit-profile">
    <div>{errors}</div>
    <div className="block-texts-username">
        <label htmlFor="input__file">
        {isImg == true ? block :
        <img src={'/uploads/default/'+image} className="image-edit-profile" />}
        </label>
        <div className="block-username">
        <span className="username-text">{localStorage.getItem('auth_name')}</span>
        <input type="file" onInput={handleChangeImage} className="input input__file" id="input__file" name="image" onChange={(e) => setPicture({image: e.target.files[0]})} /><br/>
        <div className="input__wrapper">
        <label htmlFor="input__file" className="input__file-button">
          <span className="input__file-button-text">???????????????? ???????? ??????????????</span>
        </label>
        </div>
        </div>
    </div><br/>
    <div onClick={delImg} className="del-img-btn">?????????????? ??????????????????????</div><br/>
    <div className="block-form">
        <label className="label-profile">??????</label>
        <input className="input-edit" type="text" onChange={(e) => setName(e.target.value)}  value={name} placeholder="Name" /><br/>
        <label className="label-profile">?????? ????????????????????????</label>
        <input className="input-edit" type="text" onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Username" /><br/>
        <label className="label-profile">????????</label>
        <input className="input-edit" type="text" onChange={(e) => setSite(e.target.value)}  value={site} placeholder="Site" /><br/>
        <label className="label-profile">?? ????????</label>
        <textarea className="bio" onChange={(e) => setBio(e.target.value)} placeholder="Bio" value={bio}></textarea><br/>
        <div className="personal-info-text">???????????? ????????????????????</div>
        <div className="personal-info-text-mini">?????? ???????????????? ???? ?????????? ???????????????????????? ?? ?????????? ?????????????????????????? ??????????????.</div>
        <label className="label-profile">????. ??????????</label>
        <input className="input-edit" type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" /><br/>
        <label className="label-profile">?????????? ????????????????</label>
        <input className="input-edit" type="text" onChange={(e) => setPhone(e.target.value)} value={phone} placeholder="Phone" /><br/>
        
        <button className="btnEdit" disabled={isDisabled} onClick={handleSubmit} type="submit">??????????????????????????</button>
    </div>
    </form>
    </div>
  );
}else {
  console.log(404);
}

}

export default EditProfile;
