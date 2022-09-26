import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Home from './components/Home';

function App() {
    return (
        <div className="container">
            <Router>
                <Route exact path="/" component={Home} />

                <Link to="/">HomeGO</Link>
            </Router>
        </div>
    );
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
