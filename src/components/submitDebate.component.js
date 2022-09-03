import React, { useContext, useState } from "react";
import { firestore} from "firebase";
import firebaseAppInit from "../config/firebase.js";
import { AuthContext } from "../Auth.js";
import { withRouter, Redirect } from "react-router";
import "./submitDebate.css";
import ConfirmationScreen from "./confirmationScreen.component";

const SubmitDebate = ({ history }) => {
  const { currentUser } = useContext(AuthContext);
  const [debate, setDebate] = useState("");
  const [description, setDescription] = useState("");
  const [debateError, setDebateError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [chkbox, setChkbox] = useState(true);
  const [fileName, setFileName] = useState("Choose an Image...");
  const [fileUrl, setFileUrl] = useState(null);
  const [debatePosted, setDebatePosted] = useState(false);

  let username = "";

  //Function used to clear form fields.
  const clearForm = () => {
    setDebate("");
    setDescription("");
    setDebateError("");
    setDescriptionError("");
  };

  //Function used to retrieve username field and submit input.
  const getUsername = (uid) => {
    const db = firestore();
    var docRef = db.collection("debaters").doc(currentUser.uid);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          username = doc.data().username;
        } else {
          // doc.data() will be undefined in this case
          //console.log("No such document!");
        }
      })
      .then(() => {
        createNewSubmissionDocument();
      })
      .catch(function (error) {
        //console.log("Error getting document:", error);
      });
  };

  //Function write created submission to firebase database.
  const createNewSubmissionDocument = () => {
    const db = firestore();
    //console.log(fileUrl);
    db.collection("debate submissions")
      .doc()
      .set({
        debate: debate,
        description: description,
        uid: currentUser.uid,
        username: username,
        dos: firestore.Timestamp.now(),
        shareUser: chkbox,
        image: fileUrl,
      })
      .then(() => {
        //console.log("Document successfully written!");
        clearForm();
        setDebatePosted(true);
      })
      .catch((error) => {
        //console.error("Error writing document: ", error);
        alert(error);
      });
  };

  //Helper function to upload image to firebase.
  const onFileChange = async (e) => {
    const file = e.target.files[0];
    const storageRef = firebaseAppInit.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setFileUrl(await fileRef.getDownloadURL());
    setFileName(file.name);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (formValidate()) {
      getUsername(currentUser.uid);
    }
  };

  //Helper function to validate form fields.
  const formValidate = () => {
    let returnVal = true;

    if (debate === "") {
      returnVal = false;
      setDebateError("Please provide a debate title");
    }

    if (description === "") {
      returnVal = false;
      setDescriptionError("Please provide a description");
    }
    return returnVal;
  };

  if (!currentUser.emailVerified) {
    return <Redirect to="/not-verified" />;
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-inner auth-inner-submit">
        {debatePosted && (
          <ConfirmationScreen
            message={"Submitted For Review"}
            countDownMessage={"redirecting to home page in"}
            countDown={true}
          />
        )}

        {!debatePosted && (
          <>
            {/* <div className="header"> */}
            <h3 className="submit-title">Submit a Debate</h3>
            {/* </div> */}
            <form>
              <div className="form-group">
                <label className="label-title">Debate Title</label>
                <textarea
                  value={debate}
                  onChange={(e) => setDebate(e.target.value)}
                  className="form-control form-input"
                  placeholder="Enter Your Debate Title"
                  rows="1"
                />
                <small>{debateError}</small>
              </div>

              <div className="form-group">
                <label className="label-description">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control form-input"
                  placeholder="Enter Your Debate Description"
                  as="textarea"
                  rows="1"
                />
                <small>{descriptionError}</small>
              </div>
              {/* For users to upload debate image. To be added in a future version */}
              {/* 
            <label>Debate Image</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroupFileAddon01">
                  Upload
                </span>
              </div>
              <div class="custom-file">
                <input
                  name="file"
                  type="file"
                  class="custom-file-input"
                  id="inputGroupFile01"
                  aria-describedby="inputGroupFileAddon01"
                  onChange={onFileChange}
                />
                <label class="custom-file-label" for="inputGroupFile01">
                  {fileName}
                </label>
              </div>
            </div> */}

              <div className="form-group">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customCheck1"
                    value={chkbox}
                    checked={chkbox} 
                    onChange={(e) => setChkbox(e.target.checked)}
                  />
                  {console.log(chkbox)}
                  <label
                    className="custom-control-label"
                    htmlFor="customCheck1"
                  >
                    Do you want your username to be shared?
                  </label>
                </div>
              </div>

              <button
                type="submit"
                onClick={submitHandler}
                className="btn btn-primary btn-block btn-submit"
              >
                Submit
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default withRouter(SubmitDebate);
