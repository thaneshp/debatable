import React, { useState, useCallback } from "react";
import firebaseAppInit from "../config/firebase.js";
import { firestore } from "firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./signup-login.scss";
import subDays from "date-fns/subDays";

import { Link, Switch } from "react-router-dom";
// import { withRouter } from "react-router";

const SignUp = ({ history }) => {
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [dobError, setDobError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  //Function to check validity of user input.
  const signupValidator = (fullnameVal, emailVal, passwordVal, dobVal) => {
    //Regex to check user input.
    const fullnameRegex = /^[a-zA-Z ]{5,30}$/;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let fullnameError = "";
    let emailError = "";
    let passwordError = "";
    let dobError = "";

    if (!fullnameRegex.test(fullnameVal))
      fullnameError = "Enter a full name between 5 to 30 characters long.";
    else fullnameError = "";

    if (!emailRegex.test(emailVal)) emailError = "Enter a valid email address.";
    else emailError = "";

    if (passwordVal.length < 6)
      passwordError = "Enter a password of at least 6 characters long.";
    else passwordError = "";

    if (!dobVal) dobError = "Enter your date of birth.";
    else dobError = "";

    //Set error to be displayed in form.
    if (fullnameError || emailError || passwordError) {
      setNameError(fullnameError);
      setEmailError(emailError);
      setPasswordError(passwordError);
      setDobError(dobError);

      return false;
    }

    return true;
  };

  //Function to handle debater sign-up.
  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password, fullname, dob } = event.target.elements;
      console.log(dob.value);
      if (
        signupValidator(fullname.value, email.value, password.value, dob.value)
      ) {
        try {
          const db = firestore();
          const debatersRef = db.collection("debaters");
          await firebaseAppInit
            .auth()
            .createUserWithEmailAndPassword(email.value, password.value)
            .then(() => {
              firebaseAppInit.auth().onAuthStateChanged((user) => {
                user.sendEmailVerification();
                debatersRef.doc(user.uid).set({
                  email: email.value,
                  fullname: fullname.value,
                  dob: dob.value,
                  username: "Anonymous",
                });
              });
            });
          history.push("/sign-up/choose-a-username");
        } catch (error) {
          alert(error);
        }
      }
    },
    [history]
  );

  //Debater registration form.
  return (
    <div className="authcontainer">
      <div className="auth-wrapper">
        <div className="auth-inner sign-up-inner">
          <form onSubmit={handleSignUp}>
            <h3>Register</h3>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                className="form-control form-input"
                placeholder="Your Full Name"
              />
              <small>{nameError}</small>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control form-input"
                placeholder="Your Email Address"
              />
              <small>{emailError}</small>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control form-input"
                placeholder="Your Password"
              />
              <small>{passwordError}</small>
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <br></br>
              <DatePicker
                name="dob"
                className="date-of-birth"
                dateFormat="dd/MM/yyyy"
                maxDate={subDays(new Date(), 4748)}
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="  Your Date of Birth"
              />
              <small>{dobError}</small>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-submit"
            >
              Sign Up
            </button>
            <p className="forgot-password text-center">
              <Switch>
                Already registered <Link to={"/sign-in"}>sign in?</Link>
              </Switch>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
