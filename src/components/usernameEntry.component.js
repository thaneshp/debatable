import React, { useState, useCallback, useContext, useEffect } from "react";
import firebaseAppInit from "../config/firebase.js";
import { firestore } from "firebase";
import { withRouter } from "react-router";

const UsernameEntry = ({ history }) => {
  const [usernameError, setUsernameError] = useState("");

  const handleUsernameEntry = useCallback(
    async (event) => {
      event.preventDefault();

      let usernameError = "";
      const { username } = event.target.elements;

      const db = firestore();
      const debatersRef = db.collection("debaters");
      await debatersRef
        .where("username", "==", username.value)
        .get()
        .then((snapshot) => {
          snapshot.empty
            ? (usernameError = "")
            : (usernameError = "Sorry, this username is taken.");
        });

      if (!usernameError) {
        try {
          await firebaseAppInit.auth().onAuthStateChanged((user) => {
            debatersRef.doc(user.uid).update({
              username: username.value,
            });
          });
          history.push("/");
        } catch (error) {
          alert(error);
        }
      } else {
        setUsernameError(usernameError);
      }
    },
    [history]
  );

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleUsernameEntry}>
          <h3>How would you like to be known?</h3>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              className="form-control form-input"
              placeholder="Your Username"
            />
            <small>{usernameError}</small>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-submit"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default withRouter(UsernameEntry);
