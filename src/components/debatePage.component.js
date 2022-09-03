import React, { useContext, useEffect, useState } from "react";
import { firestore, firebase } from "firebase";
import Vote from "./vote.component";
import debateCardStyles from "./debatePage.module.scss";
import { AuthContext } from "../Auth.js";
import { BsPeopleFill } from "react-icons/bs";
import { BsPersonFill } from "react-icons/bs";
import { BiCommentAdd } from "react-icons/bi";
import { GoPrimitiveDot } from "react-icons/go";
import { IconContext } from "react-icons";
import CommentsField from "./Comments/commentsField.component";
import ReactTimeAgo from "react-time-ago";

const DebatePage = (props) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [userVote, setUserVote] = useState("");
  const [voteIndicatorColor, setVoteIndicatorColor] = useState("");
  const [userSelectionDisplay, setUserSelectionDisplay] = useState("");

  const {
    location: {
      data: {
        user,
        title,
        description,
        imageUrl,
        debateID,
        noOfVotes,
        noOfAgreeVotes,
        noOfDisagreeVotes,
        dateSubmitted,
      },
    },
  } = props;

  //State variables used for updating of live components.
  const [noVotes, setNoVotes] = useState(noOfVotes);
  const [noAgreeVotes, setNoAgreeVotes] = useState(noOfAgreeVotes);
  const [noDisagreeVotes, setNoDisagreeVotes] = useState(noOfDisagreeVotes);

  const { currentUser } = useContext(AuthContext);

  const db = firestore();
  
  useEffect(() => {
    checkInteraction();
    db.collection("debates")
      .doc(debateID)
      .onSnapshot((snapshot) => {
        if (snapshot.data().no_of_votes != undefined) {
          setNoVotes(snapshot.data().no_of_votes);
        }
        if (snapshot.data().no_of_agree_votes != undefined) {
          setNoAgreeVotes(snapshot.data().no_of_agree_votes);
        }
        if (snapshot.data().no_of_disagree_votes != undefined) {
          setNoDisagreeVotes(snapshot.data().no_of_disagree_votes);
        }
      });
  }, [noVotes, noAgreeVotes, noDisagreeVotes]);

  //Check if user has interacted with this debate.
  const checkInteraction = async (e) => {
    // const db = firestore();
    await db
      .collection("debaters")
      .doc(currentUser.uid)
      .collection("debates interacted")
      .doc(debateID)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setHasUserVoted(true);
          setUserVote(snapshot.data().vote);
          if (snapshot.data().vote === "agree") {
            setVoteIndicatorColor("#74c48e");
            setUserSelectionDisplay("I agree");
          } else {
            setVoteIndicatorColor("#eb6e84");
            setUserSelectionDisplay("I disagree");
          }
        }
      });
  };

  //Function used to trigger opening and closing of comment field.
  const triggerCommentField = () => {
    if (!showCommentBox) {
      setShowCommentBox(true);
    } else {
      setShowCommentBox(false);
    }
  };

  const closeCommentField = () => {
    setShowCommentBox(false);
  };

  //Function used by vote component to show component when user is interacting for first time.
  const setUserInteraction = (vote) => {
    setHasUserVoted(true);
    if (vote === "agree") {
      setVoteIndicatorColor("#74c48e");
      setUserVote("agree");
      setUserSelectionDisplay("I Agree");
    } else {
      setVoteIndicatorColor("#eb6e84");
      setUserVote("disagree");
      setUserSelectionDisplay("I Disagree");
    }
  };

  return (
    <div className={debateCardStyles.outsideContainer}>
      <div className={debateCardStyles.wrapper}>
        <div className={debateCardStyles.inner}>
          <div className={debateCardStyles.content}>
            <h6 className={debateCardStyles.username}>{user}</h6>
            <h2>{title}</h2>
            <p>{description}</p>
            <IconContext.Provider
              value={{
                color: "rgb(101, 103, 107)",
                size: 25,
                style: {
                  verticalAlign: "center",
                  marginRight: "10px",
                  marginTop: "-5px",
                },
                className: "global-class-name",
              }}
            >
              <p className={debateCardStyles.numVotes}>
                {noVotes !== 1 ? (
                  <span>
                    <BsPeopleFill />
                    {noVotes} voters
                  </span>
                ) : (
                  <span>
                    <BsPersonFill />
                    {noVotes} voter
                  </span>
                )}
              </p>
            </IconContext.Provider>
            {hasUserVoted && (
              <IconContext.Provider
                value={{
                  color: "rgb(101, 103, 107)",
                  size: 25,
                  style: {
                    verticalAlign: "center",
                    marginRight: "5px",
                    marginTop: "0px",
                  },
                  className: "global-class-name",
                }}
              >
                <button
                  onClick={triggerCommentField}
                  className={debateCardStyles.commentButton}
                >
                  <BiCommentAdd />
                  Add a comment
                </button>
              </IconContext.Provider>
            )}
            {hasUserVoted && (
              <IconContext.Provider
                value={{
                  color: voteIndicatorColor,
                  size: 25,
                  style: {
                    verticalAlign: "center",
                    marginTop: "-4%",
                    marginRight: "1px"
                  },
                  className: "global-class-name",
                }}
              >
                <p className={debateCardStyles.voteIndicator}>
                  <GoPrimitiveDot />
                  <span style={{color: voteIndicatorColor}}>{userSelectionDisplay}</span>
                </p>
              </IconContext.Provider>
            )}
          </div>
          <h6 className={debateCardStyles.time}>
            <ReactTimeAgo date={dateSubmitted} locale="en-US" />
          </h6>
          {/* <div className={debateCardStyles.image}> */}
          {/* {imageUrl && (<img src={imageUrl} />)} */}
          {/* </div> */}
        </div>
      </div>
      {showCommentBox && (
        <CommentsField
          closeCommentField={closeCommentField}
          debateID={debateID}
          vote={userVote}
        />
      )}
      <Vote
        setUserInteraction={setUserInteraction}
        debateID={debateID}
        noOfVotes={noVotes}
        noOfAgreeVotes={noAgreeVotes}
        noOfDisagreeVotes={noDisagreeVotes}
      />
    </div>
  );
};

export default DebatePage;
