import React, { useContext, useState } from "react";
import { AuthContext } from "../Auth.js";
import { useHistory } from "react-router-dom";

import "./notVerified.css";

const NotVerified = () => {
  const [sentStatus, setSentStatus] = useState(false);

  const { currentUser } = useContext(AuthContext);


  const reSendEmail = () => {
    currentUser.sendEmailVerification();
    setSentStatus(true);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner not-verified-inner">
        <img src={require("../assets/mail_sent.svg")} />
        <h2 className="title">Verify your email</h2>
        {!sentStatus ? (
          <>
            <p className="description">
              You will need to verify your email to complete registration.
            </p>
            <p className="description">
              An email has been sent to {currentUser.email} with a link to
              verify your account. If you have not received the email after a
              few minutes, please check your spam folder.
            </p>
            <div className="inner-button">
              <div>
                <button
                  className="btn btn-primary btn-block btn-resend"
                  onClick={reSendEmail}
                >
                  Resend Email
                </button>
              </div>
              <div>
                <a href="/">
                  <button className="btn btn-primary btn-block btn-verified">
                    I've been verified
                  </button>
                </a>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="description">
              A new link has been sent to {currentUser.email}.
            </p>
            <p className="description">
              Please check your inbox/spam folder and follow the instructions
              given in the email.
            </p>
            <a href="/">
              <button className="btn btn-primary btn-block btn-verified">
                I've been verified
              </button>
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default NotVerified;
