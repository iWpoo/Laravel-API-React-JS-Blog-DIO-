import react, {useState, useEffect} from 'react';
import axios from 'axios';

const Followers = (props) => {
  return (
    <div>
      {props.followers} 
    </div>
  )
}

export default Followers;