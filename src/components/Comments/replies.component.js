import React, { useEffect, useState, useContext, useRef } from "react";
import { firestore } from "firebase";
import { AuthContext } from "../../Auth.js";
import Spinner from "react-bootstrap/Spinner";
import replyCardStyles from "./replies.module.scss";

const ReplyCard = ({ username, content, userID }) => {
  const { currentUser } = useContext(AuthContext);
 

  return (
    <div className={replyCardStyles.wrapper}>
      <div className={replyCardStyles.inner}>
        <div className={replyCardStyles.username}>{username}</div>

        <div className={replyCardStyles.content}>{content}</div>
      </div>
    </div>
  );
};


const Replies = ({ debateID, vote, commentID }) => {
  const [replies, setReplies] = useState([]);
  const [username, setUsername] = useState("")
  const db = firestore();

  useEffect(() => {
    db.collection("debates")
      .doc(debateID)
      .collection(vote)
      .doc(commentID)
      .collection("replies")
      .orderBy("dos", "asc")
      .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          var reply = new Object()
          if (change.type === "added") {
            change.doc.data().user.get().then((doc) => {

               reply.content = change.doc.data().content;
               reply.username = doc.data().username;
               setReplies((oldReplies) => [...oldReplies, reply]);
             
            })
            
          }
        });
      });
  }, []);

  if (replies === null) {
    return (
      <Spinner
        className={replyCardStyles.spinners}
        animation="border"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  return (
    <div>
      {replies !== null && (
        <div>
          {replies &&
            replies.map((replies) => {

              return (
                <ReplyCard
                  username={replies.username}
                  content={replies.content}
                />
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Replies;
