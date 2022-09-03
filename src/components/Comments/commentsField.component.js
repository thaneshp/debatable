import React, { useState, useContext } from "react";
import { firestore } from "firebase";
import { AuthContext } from "../../Auth.js";
import "./commentsField.scss";

const CommentsField = ({ closeCommentField, debateID, vote }) => {
  // console.log(props);
  const { currentUser } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [chkbox, setChkbox] = useState(false);

  const postComment = (e) => {
    e.preventDefault();

    if (formValidate()) {
      const db = firestore();

    let collectionVar = "";

    if (vote === "agree") {
      collectionVar = "agreeComments";
    } else {
      collectionVar = "disagreeComments";
    }

    db.collection("debates")
      .doc(debateID)
      .collection(collectionVar)
      .doc()
      .set({
        content: comment,
        uid: currentUser.uid,
        dos: firestore.Timestamp.now(),
        shareUser: chkbox,
        upVotes: 0,
        downVotes: 0,
        totalVotes: 0,
        user: db.doc('debaters/' + currentUser.uid)
      })
      .then(() => {
        //console.log("Document successfully written!");
        clearForm();
        closeCommentField();
      })
      .catch((error) => {
        //console.error("Error writing document: ", error);
        alert(error);
      });
      
      
    }
  };

  const formValidate = () => {
    let returnVal = true;

    if (comment === "") {
      returnVal = false;
      setCommentError("Oops please add a comment before you submit");
      
    }
    
    
    return returnVal;
  };

  const clearForm = () => {
    setComment("");
  };

  return (
    <div className="wrapper">
      <div className="inner">
        <form>
          <div className="form-group">
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
                <label className="custom-control-label" htmlFor="customCheck1">
                  Remain Anonymous?
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="form-control"
              placeholder="Type your comment here"
              as="textarea"
            />
            <small>{commentError}</small>
          </div>
          {vote === "agree" ? (
            <button
              type="submit"
              onClick={postComment}
              className="btn btn-success"
            >
              Comment
            </button>
          ) : (
            <button
              type="submit"
              onClick={postComment}
              className="btn btn-danger"
            >
              Comment
            </button>
          )}
          <button
            onClick={closeCommentField}
            className="btn btn-outline-secondary"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentsField;
