import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import '../css/auth.css';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const AddPost = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);
    formData.append('description', description);

    axios.post('http://localhost:8000/api/add-posts', formData).then(res => {
        if(res.data.status === 200) {
            navigate('/');
        }
        else {
           console.log(res.data.validation_errors);
        }
    });
  }


    return (
      <div className="blockAuth">
      <div className="borderAuth">

      <form onSubmit={handleSubmit} method="post">
          <input type="text" name="image" onChange={(e) => setImage(e.target.value)} value={image} placeholder="Image" className="username" /><br/>
          <input type="text" name="description" onChange={(e) => setDescription(e.target.value)} value={description} placeholder="Description" className="username" /><br/>
          <button type="submit" className="btnAuth">Опубликовать</button>
      </form><br/>
      </div>
      </div>
    );
}

export default AddPost;
