import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
//The CSS below is shared by comment loader and Comment Scroll
import commentDualScrollStyles from "./comments.module.scss";
import ScrollComments from "./scrollComments.component.js";
import { firestore } from "firebase";
import CommentCard from './commentCard.component'



//The following component is the individual comment card that is displayed for each comment

//Following Component loads all data to be displayed in either comments section
const Comments = ({ debateID, vote }) => {
  const [comments, setComments] = useState([]);
  const db = firestore();

  useEffect(() => {
    db.collection("debates")
      .doc(debateID)
      .collection(vote)
      .orderBy("totalVotes", "desc")
      .onSnapshot(function (snapshot) {

        snapshot.docChanges().forEach(function (change) {
          if (change.type === "added") {
            change.doc.data().user.get().then((doc) => {
              var comment = new Object()
              comment.username = doc.data().username
              comment.content = change.doc.data().content
              comment.totalVotes = change.doc.data().totalVotes
              comment.shareUser= change.doc.data().shareUser
              comment.no_of_replies = change.doc.data().no_of_replies
              comment.id = change.doc.id
              setComments((oldComments) => [...oldComments, comment]);

            })
           
          }
        });
      });
  }, []);

  //Base case no comments return

  if (comments === null) {
    return (
      <div className={commentDualScrollStyles.spinners}>
        {vote === "agreeComments" && (
          <Spinner
            className={commentDualScrollStyles.spinners}
            animation="border"
            variant="success"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}

        {vote === "disagreeComments" && (
          <Spinner
            className={commentDualScrollStyles.spinners}
            animation="border"
            variant="danger"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
      </div>
    );
  }

  //If comments are found return a scroll full of comment cards
 
  return (
    <div className={commentDualScrollStyles.CommentsLoadingwrapper}>
      <ScrollComments>
        {comments &&
          comments.map((comments) => {
            return (
              <CommentCard
                username={comments.username}
                content={comments.content}
                vote={vote}
                noVotes={comments.totalVotes}
                commentID={comments.id}
                shareUser={comments.shareUser}
                debateID={debateID}
                no_of_replies={comments.no_of_replies}
              />
            );
          })}
      </ScrollComments>
    </div>
  );
};

export default Comments;
