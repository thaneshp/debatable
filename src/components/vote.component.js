import React, { useState, useContext, useEffect } from "react";
import { firestore } from "firebase";
import { AuthContext } from "../Auth.js";
import voteStyles from "./vote.module.scss";
import { Button } from "react-bootstrap";
import { TiTick } from "react-icons/ti";
import { TiTimes } from "react-icons/ti";
import { IconContext } from "react-icons";
import Spinner from "react-bootstrap/Spinner";
import VoteBar from "./voteBar.component";
import Comments from "./Comments/comments.component";
import debateCardStyles from "./debatePage.module.scss";

export const HasInteractedContext = React.createContext();

const Vote = ({
  setUserInteraction,
  debateID,
  noOfVotes,
  noOfAgreeVotes,
  noOfDisagreeVotes,
}) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  // const [userVote, setUserVote] = useState("");

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    checkInteraction();
  });

  //Check if user has interacted with this debate.
  const checkInteraction = async (e) => {
    const db = firestore();
    await db
      .collection("debaters")
      .doc(currentUser.uid)
      .collection("debates interacted")
      .doc(debateID)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setHasInteracted(true);
          setUserChecked(true);
          // setUserVote(snapshot.data().vote);
        }
        setUserChecked(true);
      });
  };

  //Component is passed the ID string for which the vote is being cast to. Button then decides the value of the vote and completes the transaction
  const castVote = (vote) => {
    setHasInteracted(true);

    //Casts the vote to  Debater -> User -> debates interacted -> DebateID
    if (currentUser != null) {
      

      const db = firestore();
      db.collection("debaters")
        .doc(currentUser?.uid)
        .collection("debates interacted")
        .doc(debateID)
        .set({
          vote: vote,
        });

      if (vote === "agree") {
        // setUserVote(vote);

        db.collection("debates")
          .doc(debateID)
          .update({
            no_of_votes: firestore.FieldValue.increment(1),
            no_of_agree_votes: firestore.FieldValue.increment(1),
          });
      } else if (vote === "disagree") {
        // setUserVote(vote);

        db.collection("debates")
          .doc(debateID)
          .update({
            no_of_votes: firestore.FieldValue.increment(1),
            no_of_disagree_votes: firestore.FieldValue.increment(1),
          });
      }
    }
  };

  //For displaying the loading spinner.
  if (!hasInteracted && !userChecked) {
    return (
      <div className={voteStyles.spinners}>
        <Spinner
          className={voteStyles.spinners}
          animation="border"
          variant="primary"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      {!hasInteracted && userChecked ? (
        <div className={voteStyles.wrapper}>
          <div className={voteStyles.inner}>
            <div>
              <Button
                variant="success"
                onClick={(e) => {
                  e.preventDefault();
                  castVote("agree");
                  setUserInteraction("agree");
                }}
                className={voteStyles.agreeButton}
              >
                <IconContext.Provider
                  value={{
                    color: "white",
                    size: 45,
                    style: { verticalAlign: "center" },
                    className: "global-class-name",
                  }}
                >
                  <TiTick />
                </IconContext.Provider>
              </Button>
            </div>
            <div>
              <Button
                variant="danger"
                onClick={(e) => {
                  e.preventDefault();
                  castVote("disagree");
                  setUserInteraction("disagree");
                }}
                className={voteStyles.disagreeButton}
              >
                <IconContext.Provider
                  value={{
                    color: "white",
                    size: 45,
                    style: { verticalAlign: "center" },
                    className: "global-class-name",
                  }}
                >
                  <TiTimes />
                </IconContext.Provider>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <VoteBar
            debateID={debateID}
            noOfVotes={noOfVotes}
            noOfAgreeVotes={noOfAgreeVotes}
            noOfDisagreeVotes={noOfDisagreeVotes}
          />
          <div className={debateCardStyles.innerComments}>
            <div>
              <Comments debateID={debateID} vote="agreeComments" />
            </div>
            <div>
              <Comments debateID={debateID} vote="disagreeComments" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Vote;
