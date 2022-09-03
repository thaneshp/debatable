import React, { useCallback, Component } from "react";
import firebaseAppInit from "../config/firebase.js";
import { firestore } from "firebase";

import { Link } from "react-router-dom";
import { withRoute } from 'react-router'

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            fullname: '',
            email: '',
            username: '',
            password: '',
            dob: '',

            //Error messages to be displayed
            fullnameError: '',
            emailError: '',
            usernameError: '',
            passwordError: '',
            dobError: '',
        }
    }

    validateForm = () => {
        //Regex to check user input.
        const fullnameRegex = /^[a-zA-Z ]{5,30}$/;
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        //Variables to determine if error has occurred. 
        let fullnameError = '';
        let usernameError = '';
        let emailError = '';
        let passwordError = '';
        let dobError = '';

        if (!fullnameRegex.test(this.state.fullname)) fullnameError = "Enter a full name between 5 to 30 characters long.";
        else fullnameError = "";

        if (this.state.username.length < 5) usernameError = "Enter a username of at least 5 characters long.";
        else usernameError = "";

        if (!emailRegex.test(this.state.email)) emailError = "Enter a valid email address.";
        else emailError = "";

        if (this.state.password.length < 6) passwordError = "Enter a password of at least 6 characters long.";
        else passwordError = "";

        if (fullnameError || usernameError || emailError || passwordError) {
            this.setState({fullnameError, usernameError, emailError, passwordError})
            return false;
        }

        return true;
    }

    handleSignup = useCallback(async event => {
        event.preventDefault();
        try {
            await firebaseAppInit
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
            this.props.history.push("/");
        } catch(error) {
            alert(error);
        }
    }, [this.props.history]);

    // signup = (e) => {
    //     e.preventDefault();
    //     // db.settings ({
    //     //     timestampsInSnapshots: true
    //     // });

    //     //Determine if all fields are valid then submit form.
    //     if (this.validateForm()) {
    //         const db = firestore();
    //         const debaterRef = db.collection("debaters");
    //         firebaseAppInit.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
    //             debaterRef.add({
    //                 fullname: this.state.fullname,
    //                 email: this.state.email,
    //                 username: this.state.username,
    //                 dob: this.state.dob,
    //             });
    //         }).catch((error) => {
    //             console.log(error);
    //         });
    //     }
    // };

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <form>
            <h3>Register</h3>

            <div className="form-group">
                <label>Full Name</label>
                <input 
                        value={this.state.fullname}
                        onChange={this.handleChange}
                        type="text" 
                        name="fullname"
                        className="form-control" 
                        placeholder="Your Full Name" 
                    />
                <small>{this.state.fullnameError}</small>
            </div>

            <div className="form-group">
                <label>Username</label>
                <input 
                        value={this.state.username}
                        onChange={this.handleChange}
                        type="text" 
                        name="username"
                        className="form-control" 
                        placeholder="Your Username" 
                    />
                <small>{this.state.usernameError}</small>
            </div>

            <div className="form-group">
                <label>Email Address</label>
                <input 
                        value={this.state.email} 
                        onChange={this.handleChange} 
                        type="email" 
                        name="email"
                        className="form-control" 
                        placeholder="Your Email Address"
                    />
                <small>{this.state.emailError}</small>
            </div>

            <div className="form-group">
                <label>Password</label>
                <input 
                        value={this.state.password}
                        onChange={this.handleChange}
                        type="password" 
                        name="password"
                        className="form-control" 
                        placeholder="Your Password" 
                    />
                <small>{this.state.passwordError}</small>
            </div>

            <div className="form-group">
                <label>Date of Birth</label>
                <input 
                        value={this.state.dob}
                        onChange={this.handleChange}
                        type="date" 
                        name="dob"
                        className="form-control" 
                    />
                <small>{this.state.dobError}</small>
            </div>

            <button type="submit" onClick={this.handleSignup} className="btn btn-primary btn-block">Sign Up</button>
            <p className="forgot-password text-right">
                Already registered <Link to={"/sign-in"}>sign in?</Link>
            </p>
            </form>

            
        );
    }
}