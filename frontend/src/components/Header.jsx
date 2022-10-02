import {react, useState, useEffect} from 'react';
import '../css/style.css';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import {
AiOutlineHome, AiFillHome,
AiOutlineMessage, AiFillMessage,
AiOutlinePlusCircle, AiFillPlusCircle,
AiOutlineCompass, AiFillCompass,
AiOutlineHeart, AiFillHeart} from 'react-icons/ai';

const Header = () => {
  const [image, setImage] = useState(localStorage.getItem('auth_image'));

  const [isImg, setIsImg] = useState(true);

  useEffect(() => {
      if(image == 'default.jpg') {
          setIsImg(false);
      }
  })

  return (
    <div className="head">
        <header className="header">
            <Link to="/"><div className="DIO">DIO</div></Link>
            <input type="text" id="sch" placeholder="🔍 Поиск" className="schInput" />
            <div className="iconsBlock">
            <Link to="/"><AiOutlineHome className="icons"/></Link>
            <Link to="/direct/inbox/"><AiOutlineMessage className="icons" /></Link>
            <Link to="/add-post"><AiOutlinePlusCircle className="icons" /></Link>
            <Link to="/explore"><AiOutlineCompass className="icons" /></Link>
            <Link to="/notification"><AiOutlineHeart className="icons" /></Link>
            <Link to={"/profile/"+localStorage.getItem('auth_id')}>
            {isImg == true ? <img src={'/uploads/profiles/'+image} className="icons imgicon" /> :
            <img src={'/uploads/default/'+image} className="icons imgicon" />}
            </Link>
            </div>
        </header>
    </div>
  );
}

export default Header;
