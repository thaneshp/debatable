import React, { useCallback, useContext, useState } from "react";
import firebaseAppInit from '../config/firebase.js'
import { AuthContext } from '../Auth.js'
import firebase from "firebase";

import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import './signup-login.scss';

const Login = ({ history }) => {
    const [rememberMe, setRememberMe] = useState(true);

    //Function to handle user login.
    const handleLogin = useCallback(async event => {
        event.preventDefault();
        const { email, password, remember } = event.target.elements;
        try {
            //Used for remember me functionality.
            if (remember.checked) firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            else firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
            //Firebase default function to validate user credentials.
            await firebaseAppInit
                .auth()
                .signInWithEmailAndPassword(email.value, password.value);
                //console.log("Remember me: " + rememberMe);
            history.push("/");
        } catch(error) {
            alert(error);
        }
    }, [history]);

    const { currentUser } = useContext(AuthContext);

    if (currentUser) {
        return <Redirect to="/" />;
    }

    const triggerRememberMe = () => {
        setRememberMe(!rememberMe);
    }

    return (
        <div className="authcontainer">
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={handleLogin}>
                <h3>Login</h3>

                <div className="form-group">
                    <label>Email address</label>
                    <input 
                            type="email" 
                            name="email"
                            className="form-control form-input" 
                            placeholder="Enter email" 
                        />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input 
                            type="password" 
                            name="password"
                            className="form-control form-input" 
                            placeholder="Enter password" 

                        />
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input 
                            name="remember" 
                            type="checkbox" 
                            className="custom-control-input" 
                            id="customCheck1"
                            checked={rememberMe} 
                            onChange={triggerRememberMe}
                            // onChange={checked => setRememberMe(checked)}
                        />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-submit">Login</button>
                <p className="forgot-password text-center">
                    Forgot <Link to={"/forgot-password"}>password?</Link>
                </p>
                </form>
            </div>
        </div> 
        </div>

    );
}

export default Login;