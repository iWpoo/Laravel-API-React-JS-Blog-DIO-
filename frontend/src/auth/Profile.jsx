import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import '../css/auth.css';
import axios from 'axios';
import {AiOutlineSetting} from 'react-icons/ai';
import Followers from './followers/Followers';
import Following from './followers/Following';
import PostsUser from './posts/PostsUser';
import LikesPost from './posts/LikesPost';

const Profile = (props) => {
  const history = useNavigate();
  const [userProfile, setUser] = useState({
      username: '',
      name: '',
      bio: '',
      image: '',
      token: '',
      site: '',
      phone: '',
      is_private: '',
  });

  let CryptoJS = require("crypto-js");
  const tk = userProfile.token;
  let dtk = CryptoJS.AES.decrypt(tk, 'my-secret-token');


  // Getting information about the users

  const {id} = useParams();

  useEffect(() => {
      axios.get(`http://localhost:8000/api/profile/${id}`).then( res => {
          if(res.data.status === 200)
          {
              setUser(res.data.user);
          }
          else if(res.data.status === 404)
          {
              history('/');
          }
      });

  }, []);


  // Change the image profile

  const [image, setImage] = useState('');
  const [bio, setBio] = useState('');
  const [picture, setPicture] = useState([]);
  const [errors, setErrors] = useState('');
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
              alert(res.data.validate_err);
              setFlip(false);
          }else {
            setFlip(false);
          }
      });
    }
  }, []);

  const [isImg, setIsImg] = useState(true);

  useEffect(() => {
      if(userProfile.image == 'default.jpg') {
          setIsImg(false);
      }
  })


  // Get Followers

  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [textBtnFollow, setTextBtnFollow] = useState('Подписаться');

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

    axios.get(`http://localhost:8000/api/followers/`).then( res => {
      if(res.data.status === 200)
      {
        setFollowers(res.data.followers);
      }
      else if(res.data.status === 404)
      {
        history('/');
      }
    });


  }, []);

  
  // Delete followers

  const [delId, setDelId] = useState();

  useEffect(() => {
    if(delId != undefined) {
      axios.delete(`http://localhost:8000/api/unfollow/${delId}`).then( res => {
        if(res.data.status === 200)
        {
          window.location.reload();
        }
      });
    }
  }, [])

  let boolean = false;
  let bool = false;
  let idToDel = 0;
  let counter = 0;
  let str = String(counter);
  let img = 'default';
  let block = '';
  let dtk2 = '';

  let viewMap = followers.map((item, index) => {
    if(id == item.user_id && localStorage.getItem('auth_id') == item.follower_id) {
      idToDel = item.id;
      bool = true;
    }

    if(id == item.user_id) {
      return (
        <div key={item.id}>
          {
            users.map((el, index) => {
              if(item.follower_id === el.id) {
                counter++;
                block = (
                  <div>
                    <a href={"/profile/"+el.id}>
                      <div className="fol_username_text">{el.username}</div>
                    </a>
                    <div className="fol_bio_text">{el.bio}</div>
                  </div>);
                
                if(el.image != 'default.jpg') img = 'profiles';
                else img = 'default';  

                dtk2 = CryptoJS.AES.decrypt(el.token, 'my-secret-token');
  
                if(dtk2.toString(CryptoJS.enc.Utf8) == localStorage.getItem('auth_token')) boolean = true;
                
                if(localStorage.getItem('auth_token') == dtk.toString(CryptoJS.enc.Utf8) && localStorage.getItem('auth_id') == id) {
                return (
                  <div key={el.id} className="followers_block">
                    <a href={"/profile/"+el.id}><img className="avatarka" width="48px" height="48px" src={'/uploads/' + img + '/' + el.image} /></a>                   
                    <div className="block_followers_text">
                      {counter != 0 ? block : 'Нету подписчиков...'}
                    </div>
                    {counter != 0 ? <div onClick={() => {setDelId(item.id)}} className="text-del">Удалить</div> : <div></div>}
                  </div>
                )
                } else {
                  return (
                  <div key={el.id} className="followers_block">
                    <a href={"/profile/"+el.id}><img className="avatarka" width="48px" height="48px" src={'/uploads/' + img + '/' + el.image} /></a>                   
                    <div className="block_followers_text">
                      {counter != 0 ? block : 'Нету подписчиков...'}
                    </div>
                  </div>
                )
                }
              }
            })
          }
        </div>
      )
    }
  });

  if(counter > 9999) counter = str[0]+str[1] + 'K'; 
  if(counter > 99999) counter = str[0]+str[1]+str[2] + 'K'; 
  if(counter > 999999) counter = str[0] + 'M'; 
  if(counter > 9999999) counter = str[0] + str[1] + 'M'; 
  if(counter > 99999999) counter = str[0] + str[1] + str[2] + 'M'; 


  // Get following

  const [user_id2, setUserId2] = useState(0);
  const [followsOrNot1, setFollowsOrNot1] = useState('');
  const [followsOrNot2, setFollowsOrNot2] = useState('disapear');
  const [disable, setDisable] = useState(false);

  let counter2 = 0;
  let str2 = String(counter2);
  let block2 = '';
  let viewMap2 = followers.map((item, index) => {
    if(id == item.follower_id) {
      return (
        <div key={item.id}>
          {
            users.map((el, index) => {
              if(item.user_id === el.id) {
                counter2++;
                block2 = (<div><a href={"/profile/"+el.id}><div className="fol_username_text">{el.username}</div></a><div className="fol_bio_text">{el.bio}</div></div>);
                if(el.image != 'default.jpg') img = 'profiles';
                else img = 'default';

                return (
                  <div key={el.id} className="followers_block">
                    <a href={"/profile/"+el.id}><img className="avatarka" width="48px" height="48px" src={'/uploads/' + img + '/' + el.image} /></a>
                    <div className="block_followers_text">
                      {counter2 != 0 ? block2 : 'Нету подписок...'}
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

  if(counter2 > 9999) counter2 = str2[0]+str2[1] + 'K'; 
  if(counter2 > 99999) counter2 = str2[0]+str2[1]+str2[2] + 'K'; 
  if(counter2 > 999999) counter2 = str2[0] + 'M'; 
  if(counter2 > 9999999) counter2 = str2[0] + str2[1] + 'M'; 
  if(counter2 > 99999999) counter2 = str2[0] + str2[1] + str2[2] + 'M'; 
  

  // Follow on user
  
  const [follower_id, setFollowerId] = useState(localStorage.getItem('auth_id'));
  const [user_id, setUserId] = useState(id);

  useEffect(() => {    
    if(boolean === true) {
      setFollowsOrNot1('disapear');
      setFollowsOrNot2('');
    }else {
      setFollowsOrNot1('');
      setFollowsOrNot2('disapear');
    }

    if(user_id2 != 0) {
      const formData = new FormData();
      formData.append('follower_id', follower_id);
      formData.append('user_id', user_id2);

      axios.post('http://localhost:8000/api/tofollow', formData).then(res => {
        if(res.data.status === 200) {
          window.location.reload();
        }
        else {
          console.log(res.data.validation_errors);
        }
      });
    }
  }, [])


  const handleToFollow = (e) => {
    e.preventDefault();
    setDisable(true);

    const formData = new FormData();
    formData.append('follower_id', follower_id);
    formData.append('user_id', user_id);

    axios.post('http://localhost:8000/api/tofollow', formData).then(res => {
        if(res.data.status === 200) {
          window.location.reload();
        }
        else {
          console.log(res.data.validation_errors);
        }
    });
  }

  const handleUnfollow = (e) => {
    e.preventDefault();

    setDelId(idToDel);
  }


  // Logout

  const logout = () => {
    localStorage.clear();
    history('/');
    window.location.reload();
  }


  // Open/Close the Settings

  const [clsName, setClsName] = useState('disapear');
  const [clsName2, setClsName2] = useState('');
  const [clsName3, setClsName3] = useState('disapear');
  const [clsName4, setClsName4] = useState('disapear');

  const openSettings = () => {
    setClsName('');
    setClsName2('blur');
  }


  // Open the followers list

  const openList = () => {
    setClsName3('');
    setClsName2('blur');
  }

  const openList2 = () => {
    setClsName4('');
    setClsName2('blur');
  }

  const cancel = () => {
    if(clsName == '') {
      setClsName('disapear');
      setClsName2('');
    }
    if(clsName3 == '') {
      setClsName3('disapear');
      setClsName2('');
    }
    if(clsName4 == '') {
      setClsName4('disapear');
      setClsName2('');
    }
  }

  if(localStorage.getItem('auth_token') == dtk.toString(CryptoJS.enc.Utf8) && localStorage.getItem('auth_id') == id) {
  return (
    <div>
      <div className="block-center">
      <div className={clsName3}>
      <div className="block-followers">
        <div onClick={cancel} className="xcancel">×</div>
        <div className="text_subs">Подписчики</div>
        <hr/>
        <div>
          <Followers followers={viewMap} />
        </div>
      </div>
      </div>
      </div>

      <div className="block-center">
      <div className={clsName4}>
      <div className="block-followers">
        <div onClick={cancel} className="xcancel">×</div>
        <div className="text_subs">Подписки</div>
        <hr/>
        <div>
          <Following followers={viewMap2} />
        </div>
      </div>
      </div>
      </div>
      

      <div className="block-center">
      <div className={clsName}>
      <div className="block-settings">
        <div><br/>
          <Link to="/accounts/password/change/"><div className="text-settings">Сменить пароль</div></Link>
          <hr/>
          <Link to="/accounts/privacy_and_security/"><div className="text-settings">Конфиденциальность и безопасность</div></Link>
          <hr/>
          <div className="text-settings" onClick={logout}>Выйти</div>
          <hr/>
          <div onClick={cancel} className="text-settings">Отмена</div>
        </div>
      </div>
      </div>
      </div>

    <div className={"profile " + clsName2}>
      <input type="file" onInput={handleChangeImage} className="input input__file" id="input__file" name="image" onChange={(e) => setPicture({image: e.target.files[0]})} /><br/>
      <label htmlFor="input__file">
      {isImg == true ? <img className="avatarka" src={'/uploads/profiles/'+userProfile.image} width="150" height="150" /> :
      <img className="avatarka" src={'/uploads/default/'+userProfile.image} width="150" height="150" />}
      </label>
      <div className="blockInfo">
        <div className="profile-username">{userProfile.username}</div>
        <Link to={"/accounts/edit/"}><button className="to-edit-profile">Редактировать профиль</button></Link>
        <AiOutlineSetting className="icons" onClick={openSettings} /><br/><br/>
 
        <div className="CountersBlock">
          <div className="counter_text"><b>345</b> публикаций</div>&nbsp;&nbsp;&nbsp;
          <div onClick={openList} className="counter_text"><b>{counter}</b> подписчиков</div>&nbsp;&nbsp;&nbsp;
          <div onClick={openList2} className="counter_text"><b>{counter2}</b> подписок</div>
        </div><br/>

        <div className="profile-name">{userProfile.name}</div>
        <div className="profile-bio">{userProfile.bio}</div>
      </div>
    </div>
    <hr className="hr" />


    <Routes>
      <Route path={"/profile/" + id} element={<PostsUser />} />
      <Route path={"/profile/" + id + "/likes"} element={<LikesPost />} />
    </Routes>

    </div>
  );
  }
  else if(localStorage.getItem('auth_token') != dtk.toString(CryptoJS.enc.Utf8)){
    if(userProfile.is_private != 'true') {
    return (
      <div>
      <div className="block-center">
      <div className={clsName3}>
      <div className="block-followers">
        <div onClick={cancel} className="xcancel">×</div>
        <div className="text_subs">Подписчики</div>
        <hr/>
        <div>
          <Followers followers={viewMap} />
        </div>
      </div>
      </div>
      </div>
      
      <div className="block-center">
      <div className={clsName4}>
      <div className="block-followers">
        <div onClick={cancel} className="xcancel">×</div>
        <div className="text_subs">Подписки</div>
        <hr/>
        <div>
          <Following followers={viewMap2} />
        </div>
      </div>
      </div>
      </div>

      <div onClick={cancel} className={"profile " + clsName2}>
        {isImg == true ? <img className="avatarka" src={'/uploads/profiles/'+userProfile.image} width="150" height="150" /> :
        <img className="avatarka" src={'/uploads/default/'+userProfile.image} width="150" height="150" />}
        <div className="blockInfo">
          <div className="move_to_center">
          <div className="profile-username">{userProfile.username}</div>
          <button onClick={handleToFollow} disabled={disable} className={"subsrcibe " + followsOrNot1}>Подписаться</button>
          <button className={"subsrcibed " + followsOrNot2}>Написать</button>
          <button onClick={handleUnfollow} className={"subsrcibed " + followsOrNot2}>Отписаться</button><br/><br/>
          </div>
          <div className="CountersBlock">
            <div className="counter_text"><b>345</b> публикаций</div>&nbsp;&nbsp;&nbsp;
            <div onClick={openList} className="counter_text"><b>{counter}</b> подписчиков</div>&nbsp;&nbsp;&nbsp;
            <div onClick={openList2} className="counter_text"><b>{counter2}</b> подписок</div>
          </div><br/>
          <div className="profile-name">{userProfile.name}</div>
          <div className="profile-bio">{userProfile.bio}</div>
        </div>
      </div>
      <hr className="hr" />

      </div>
    );
    }else {
      if(bool == true) {
      return (
      <div>
      <div className="block-center">
      <div className={clsName3}>
      <div className="block-followers">
        <div onClick={cancel} className="xcancel">×</div>
        <div className="text_subs">Подписчики</div>
        <hr/>
        <div>
          <Followers followers={viewMap} />
        </div>
      </div>
      </div>
      </div>
      
      <div className="block-center">
      <div className={clsName4}>
      <div className="block-followers">
        <div onClick={cancel} className="xcancel">×</div>
        <div className="text_subs">Подписки</div>
        <hr/>
        <div>
          <Following followers={viewMap2} />
        </div>
      </div>
      </div>
      </div>

      <div onClick={cancel} className={"profile " + clsName2}>

        {isImg == true ? <img className="avatarka" src={'/uploads/profiles/'+userProfile.image} width="150" height="150" /> :
        <img className="avatarka" src={'/uploads/default/'+userProfile.image} width="150" height="150" />}
        <div className="blockInfo">
          <div className="move_to_center">
          <div className="profile-username">{userProfile.username}</div>
          <button className={"subsrcibed " + followsOrNot2}>Написать</button>
          <button onClick={handleUnfollow} className={"unfollowsBtn " + followsOrNot2}>Отписаться</button><br/><br/>
          </div>
          <div className="CountersBlock">
            <div className="counter_text"><b>345</b> публикаций</div>&nbsp;&nbsp;&nbsp;
            <div onClick={openList} className="counter_text"><b>{counter}</b> подписчиков</div>&nbsp;&nbsp;&nbsp;
            <div onClick={openList2} className="counter_text"><b>{counter2}</b> подписок</div>
          </div><br/>
          <div className="profile-name">{userProfile.name}</div>
          <div className="profile-bio">{userProfile.bio}</div>
        </div>
      </div>
      <hr className="hr" />

      <PostsUser />

      </div>
    ); 
      }else {
      return (
        <div>
      <div className="profile">
        {isImg == true ? <img className="avatarka" src={'/uploads/profiles/'+userProfile.image} width="150" height="150" /> :
        <img className="avatarka" src={'/uploads/default/'+userProfile.image} width="150" height="150" />}
        <div className="blockInfo">
          <div className="profile-username">{userProfile.username}</div>
          <button onClick={handleToFollow} disabled={disable} className={"subsrcibe " + followsOrNot1}>Подписаться</button>

          <div className="CountersBlock">
            <div className="counter_text"><b>345</b> публикаций</div>&nbsp;&nbsp;&nbsp;
            <div className="counter_text"><b>{counter}</b> подписчиков</div>&nbsp;&nbsp;&nbsp;
            <div className="counter_text"><b>{counter2}</b> подписок</div>
          </div><br/>
          <div className="profile-name">{userProfile.name}</div>
          <div className="profile-bio">{userProfile.bio}</div>
        </div>
        <h3>Закрытый аккаунт</h3>
      </div>
      <hr className="hr" />
      </div>
      );
      }
    }
  }
}

export default Profile;
