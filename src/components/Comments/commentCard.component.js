import React, { useEffect, useState, useContext} from "react";
import commentCardStyles from "./commentCard.module.scss";
import { TiArrowSortedUp } from "react-icons/ti";
import { TiArrowSortedDown } from "react-icons/ti";
import { IconContext } from "react-icons";
import TextTransition, { presets } from "react-text-transition";
import { firestore } from "firebase";
import { AuthContext } from "../../Auth.js";
import Replies from "./replies.component";


const CommentCard = ({
    username,
    content,
    vote,
    noVotes,
    commentID,
    shareUser,
    debateID,
    no_of_replies,
  }) => {
    const [selected, setSelected] = useState("");
    const [voteCounter, setVoteCounter] = useState(noVotes);
    const [repliesCounter, setRepliesCounter] = useState(no_of_replies);
    const [boxShadow, setBoxShadow] = useState({});
    const [usernameColor, setUsernameColor] = useState({});
    const { currentUser } = useContext(AuthContext);
    const [showReplyField, setShowReplyField] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [reply, setReply] = useState("");
    const [showRepliesButton, setShowRepliesButton] = useState(false);
    const db = firestore();
    let oldVoteCount = 0;
    let didVoteUpdate = false;
  
    useEffect(() => {
      if (vote === "agreeComments") {
        setBoxShadow({ "box-shadow": "rgba(116,196,142, 0.2) 0px 3px 8px" });
        setUsernameColor({ color: "#5a996e" });
      } else {
        setBoxShadow({ "box-shadow": "rgba(235,110,132, 0.2) 0px 3px 8px" });
        setUsernameColor({ color: "#cc5e71" });
      }
  
      if (repliesCounter > 0) {
        setShowRepliesButton(true);
      }

      const docRef = db
        .collection("debaters")
        .doc(currentUser.uid)
        .collection("debates interacted")
        .doc(debateID)
        .collection("commentsInteracted")
        .doc(commentID);
      docRef.get().then((doc) => {
        if (doc.exists) {
          setSelected(doc.data().vote);
        } else {
          // doc.data() will be undefined in this case
          // console.log("No such document!");
        }
      });
  
      db.collection("debates")
        .doc(debateID)
        .collection(vote)
        .doc(commentID)
        .onSnapshot((snapshot) => {
          if (snapshot.data().totalVotes != undefined) {
            oldVoteCount = voteCounter;
            didVoteUpdate = true;
            setVoteCounter(snapshot.data().totalVotes);
            //console.log(voteCounter);
          }
          if (snapshot.data().no_of_replies != undefined) {
            setRepliesCounter(snapshot.data().no_of_replies);
            setShowRepliesButton(true);
          }
        });
    }, [voteCounter, showReplies]);
  
    const postReply = (e) => {
      e.preventDefault();

      var batch = db.batch();
  
      if (reply !== "") {

            const docRef = db
              .collection("debates")
              .doc(debateID)
              .collection(vote)
              .doc(commentID)
              .collection("replies")
              .doc()
              
              batch.set(docRef,{
                content: reply,
                dos: firestore.Timestamp.now(),
                user: db.doc('debaters/' + currentUser.uid)
              })
             
            const storyRef = db
              .collection("debates")
              .doc(debateID)
              .collection(vote)
              .doc(commentID);

            batch.update(storyRef,{
              no_of_replies: firestore.FieldValue.increment(1),
            });
            
            batch.commit().then(() => {
             //Clear reply field
            setReply("");
          });
            
         
        
      }
    };
  
    const postVote = (currentVote) => {

      var upVotes = 0
      var downVotes = 0
      var totalVotes = 0
      var record = ""
      
          console.log("selected " + selected)
          console.log("current vote" + selected)
          console.log("commentID" + commentID)
          if (currentVote === "upVote" && selected === ""){
            upVotes = 1
            downVotes = 0
            totalVotes = 1
            record = "upVote"
           
          }
          else if(currentVote === "upVote" && selected === "downVote"){
            upVotes = 1
            downVotes = -1
            totalVotes = 2
            record = "upVote"
            
          }

          else if(currentVote === "upVote" && selected === "upVote"){
            upVotes = -1
            downVotes = 0
            totalVotes = -1
            record = ""
            
           
          }
          else if(currentVote === "downVote" && selected === "") {
            upVotes = 0
            downVotes = 1
            totalVotes = -1
            record = "downVote"
            
            
          }
          else if(currentVote === "downVote" && selected === "upVote"){
            upVotes = -1
            downVotes = 1
            totalVotes = -2
            record = "downVote"
          
              
            }

          else if(currentVote === "downVote" && selected === "downVote") {
            upVotes = 0
            downVotes = -1
            totalVotes = 1
            record = ""
           
            
            }
            var batch = db.batch();
        
            const storyRef = db
        .collection("debates")
        .doc(debateID)
        .collection(vote)
        .doc(commentID);

        batch.update(storyRef,{
          upVotes: firestore.FieldValue.increment(upVotes),
          downVotes: firestore.FieldValue.increment(downVotes),
          totalVotes: firestore.FieldValue.increment(totalVotes),
        })

        const recordRef = db.collection("debaters")
        .doc(currentUser.uid)
        .collection("debates interacted")
        .doc(debateID)
        .collection("commentsInteracted")
        .doc(commentID)

        batch.set(recordRef,{
          vote: record,
          dos: firestore.Timestamp.now(),
        })

        batch.commit().then(() => {

          setSelected(record)
         
       });

    };


     
  
    return (
      <div className={commentCardStyles.wrapper}>
        <div style={boxShadow} className={commentCardStyles.inner}>
          <div className={commentCardStyles.voteButtons}>
            <button
              className={commentCardStyles.upVoteButton}
              onClick={(e) => {
                e.preventDefault();
                postVote("upVote");
                console.log("thisRan")
              }}
            >
              {selected !== "upVote" && (
                <IconContext.Provider
                  value={{
                    color: "#878a8c",
                    size: 30,
                    style: { verticalAlign: "center" },
                    className: "global-class-name",
                  }}
                >
                  <div>
                    <TiArrowSortedUp />
                    {/* <BsArrowUp/> */}
                  </div>
                </IconContext.Provider>
              )}
  
              {selected === "upVote" && (
                <IconContext.Provider
                  value={{
                    color: "blue",
                    size: 30,
                    style: { verticalAlign: "center" },
                    className: "global-class-name",
                  }}
                >
                  <div>
                    <TiArrowSortedUp />
                    {/* <BsArrowUp/> */}
                  </div>
                </IconContext.Provider>
              )}
            </button>
  
            {voteCounter > oldVoteCount && (
              <div className={commentCardStyles.votes}>
                {" "}
                {
                  <TextTransition
                    text={voteCounter}
                    direction="down"
                    springConfig={presets.wobbly}
                  />
                }{" "}
              </div>
            )}
  
            {voteCounter == oldVoteCount && (
              <div className={commentCardStyles.votes}>{voteCounter}</div>
            )}
  
            {voteCounter < oldVoteCount && (
              <div className={commentCardStyles.votes}>
                {" "}
                {
                  <TextTransition
                    text={voteCounter}
                    direction="up"
                    springConfig={presets.wobbly}
                  />
                }
              </div>
            )}
  
            <button
              className={commentCardStyles.downVoteButton}
              onClick={(e) => {
                e.preventDefault();
                postVote("downVote");
              }}
            >
              {selected !== "downVote" && (
                <IconContext.Provider
                  value={{
                    color: "#878a8c",
                    size: 30,
                    style: { verticalAlign: "center" },
                    className: "global-class-name",
                  }}
                >
                  <div>
                    <TiArrowSortedDown />
                    {/* <BsArrowDown/> */}
                  </div>
                </IconContext.Provider>
              )}
  
              {selected === "downVote" && (
                <IconContext.Provider
                  value={{
                    color: "blue",
                    size: 30,
                    style: { verticalAlign: "center" },
                    className: "global-class-name",
                  }}
                >
                  <div>
                    <TiArrowSortedDown />
                    {/* <BsArrowDown/> */}
                  </div>
                </IconContext.Provider>
              )}
            </button>
          </div>
  
          {shareUser === true && (
            <div style={usernameColor} className={commentCardStyles.username}>
              {username}
            </div>
          )}
  
          {shareUser !== true && (
            <div style={usernameColor} className={commentCardStyles.username}>
              Anonymous
            </div>
          )}
  
          <div className={commentCardStyles.content}>{content}</div>
        </div>
        <div>
          <button
            className={commentCardStyles.reply}
            onClick={(e) => {
              e.preventDefault();
              if (showReplyField === true) {
                setShowReplyField(false);
              } else {
                setShowReplyField(true);
              }
            }}
          >
            Reply
          </button>
  
          {showRepliesButton && (
            <button
              className={commentCardStyles.reply}
              onClick={(e) => {
                e.preventDefault();
                if (showReplies === true) {
                  setShowReplies(false);
                } else {
                  setShowReplies(true);
                }
              }}
            >
              {showReplies && "Close"}
              {!showReplies && "Show replies " + "(" + repliesCounter + ")"}
            </button>
          )}
  
          {showReplies && (
            <Replies debateID={debateID} vote={vote} commentID={commentID} />
          )}
        </div>
  
        {showReplyField && (
          <div className={commentCardStyles.replyContainer}>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className={commentCardStyles.replyField}
              placeholder="Write your response here."
              as="textarea"
            />
            <button
              type="submit"
              onClick={postReply}
              className={commentCardStyles.replyButton}
            >
              Reply
            </button>
          </div>
        )}
      </div>
    );
  };

  
  export default CommentCard;