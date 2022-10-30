import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import '../css/auth.css';
import axios from 'axios';

const Followers = (props) => {

  return (
    <div>
      {props.followers}
    </div>
  )
}

export default Followers;