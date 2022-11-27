import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';

const LikesPost = (props) => {
    const {id} = useParams();
	const [posts, setPosts] = useState([]);
	const [likes, setLikes] = useState([]);

	useEffect(() => {
        axios.get(`http://localhost:8000/api/posts`).then( res => {
          if(res.data.status === 200)
          {
            setPosts(res.data.posts);
          }
          else if(res.data.status === 404)
          {
            console.log(404);
          }
        });

        axios.get(`http://localhost:8000/api/likes-get`).then( res => {
            if(res.data.status === 200)
            {
              setLikes(res.data.likes);
            }
            else if(res.data.status === 404)
            {
              console.log(404);
            }
        });
    }, []);

    let image = '';
    let video = '';
    let block = '';

    return (
    	<div>
    	<div className="block-switch-posts">
    	    <div className="block-switch">
                <Link to={"/profile/" + id}><span className="element active">POSTS</span></Link>
                <span className="element">LIKES</span>
            </div>
        </div>
    	<div className="block-center">
        <div className="block-posts-profile">
        	{
        		posts.map((post, i) => {
                
        			return (
        			    <div key={post.id} className="postBg">
        				    {
        				    	likes.map((like, i) => {
        				    	if(like.id_post == post.id) {
        				    		image = (<Link to={"/post/" + post.id}><img src={"/uploads/posts/" + post.post} width="300px" height="300px" className="postsProfile" /></Link>);
                                    video = (
                                      <Link to={"/post/" + post.id}><video className="postsProfile" width="300px" height="300px" autoPlay loop muted>
                                        <source src={"/uploads/videos/" + post.post} type="video/mp4" />
                                      </video></Link> 
                                    );
                
                                    if(post.post.includes('.mp4') === true) {
                                      block = video;
                                    }else {
                                      block = image;
                                    }

        				    		return (
                                        <div key={i}>
                                        	
                                        </div>
        				    		)
        				    	}
        				    	})
        				    }
        			    </div>
        			)
        		})
        	}
        </div>
        </div>
        </div>
    )
}

export default LikesPost;