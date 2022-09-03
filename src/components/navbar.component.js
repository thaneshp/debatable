import React, { useContext } from "react";
import firebaseAppInit from "../config/firebase";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AuthContext } from '../Auth.js'
import { useHistory } from 'react-router-dom'
import './navbar.css'

const Navbar = () => {
    
    const history = useHistory();

    const logout = () => {
        firebaseAppInit.auth().signOut();
        history.push('/sign-in');
    }

    const { currentUser } = useContext(AuthContext);

    return ( 
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
            <Link className="navbar-brand" to={"/sign-in"}> <img className="logo" src={require("../assets/2.jpg")} /></Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
                {currentUser ? (
                <>
                    <li className="nav-item">
                    <Link className="nav-link cta" to={"/submit-debate"}>Submit A Debate</Link>   
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" onClick={logout}>Logout</Link>
                    </li> 
                </>   
                    ) : (
                <>
                    <li className="nav-item">
                    <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" to={"/sign-in"}>Login</Link>
                    </li>
                </>
                    )
                }
            </ul>
            </div>
        </div>
        </nav> 
    );
}

export default Navbar;