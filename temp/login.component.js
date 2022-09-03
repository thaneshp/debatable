import React, { Component } from "react";
import firebaseAppInit from '../config/firebase.js'
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            email: '',
            password: '',

            //Used for displaying error messages
            emailError: '',
            passwordError: ''
        }
    }

    login(e) {
        e.preventDefault();
        firebaseAppInit.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
            console.log(u.uid);
        }).catch((error) => {
            console.log(error);
            //Determine error and set to be displayed.
            if (error.code === 'auth/invalid-email') this.setState({emailError: error.message});
            else if (error.code === 'auth/user-not-found') this.setState({ 
                emailError: 'There is no user corresponding to this email.'
            })
            else this.setState({emailError: ''});

            if (error.code === 'auth/wrong-password') this.setState({passwordError: error.message});
            else this.setState({passwordError: ''});
        });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <form>
            <h3>Login</h3>

            <div className="form-group">
                <label>Email address</label>
                <input 
                        value={this.state.email} 
                        onChange={this.handleChange} 
                        type="email" 
                        name="email"
                        className="form-control" 
                        placeholder="Enter email" 
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
                        placeholder="Enter password" 

                    />
                <small>{this.state.passwordError}</small>
            </div>

            <div className="form-group">
                <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id="customCheck1" />
                    <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                </div>
            </div>

            <button type="submit" onClick={this.login} className="btn btn-primary btn-block">Submit</button>
            <p className="forgot-password text-right">
                Forgot <Link to={"/forgot-password"}>password?</Link>
            </p>
        </form>
        );
    }
}