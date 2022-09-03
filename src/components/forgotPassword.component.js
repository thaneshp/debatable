import React, { useState } from "react";
import firebase from "firebase";
import { withRouter } from "react-router";
import ConfirmationScreen from "./confirmationScreen.component";

const ForgotPassword = ({ history }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [forgotPasswordSent, setforgotPasswordSent] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();

    var auth = firebase.auth();

    if (formValidate()) {
      auth
        .sendPasswordResetEmail(email)
        .then(() => {
          setEmailError("Email Successfully Sent.");
          setforgotPasswordSent(true);
          clearForm();
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const formValidate = () => {
    let returnVal = true;

    if (email === "") {
      returnVal = false;
      setEmailError("Please enter the email associated with your account");
    }

    return returnVal;
  };

  const clearForm = () => {
    setEmail("");
    setEmailError("");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        {forgotPasswordSent && (
          <ConfirmationScreen
            message={"A password reset link has been emailed"}
            countDownMessage={"redirecting to home page in"}
            countDown={true}
          />
        )}

        {!forgotPasswordSent && (
          <form>
            <h3>Recover Password</h3>

            <div className="form-group">
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Your Email Address"
              />
              <small>{emailError}</small>
            </div>
            <button
              type="submit"
              onClick={submitHandler}
              className="btn btn-primary btn-block btn-submit"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default withRouter(ForgotPassword);
