import React, { useState, useEffect, useContext, cloneElement } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar'
import VoteBarStyles from './voteBar.module.scss'


const VoteBar = ({ debateID, noOfVotes, noOfAgreeVotes, noOfDisagreeVotes }) => {
    const [agreePercentage, setAgreePercentage] = useState(0);
    const [disagreePercentage, setDisagreePercentage] = useState(0);
    const [debateData, setDebateData] = useState(null);

    // const { hasInteracted } = useContext(HasInteractedContext);

    useEffect(() => {
        setPercentage();
        // console.log("from vote bar " + noOfVotes);
        // console.log(noOfAgreeVotes);
        // console.log(noOfDisagreeVotes)
    }, [noOfVotes, noOfAgreeVotes, noOfDisagreeVotes])

    //Retrieve debate statistics from firebase.
    // useEffect(() => {
    //     const db = firestore();
    //     db.collection("debates").doc(debateID)
    //         .get()
    //         .then(snapshot => {
    //             const debateData = snapshot.data();
    //             setDebate(debateData);
    //         }).catch(error => {
    //             console.log(error)
    //         });
    // }, [])

    const setPercentage = () => {
        let agreePercentage = (noOfAgreeVotes/noOfVotes)*100;
        let disagreePercentage = (noOfDisagreeVotes/noOfVotes)*100;
  
        setAgreePercentage(agreePercentage);
        setDisagreePercentage(disagreePercentage);
    } 

    return (
        <>
        <ProgressBar className={VoteBarStyles.progressBar}>
            <ProgressBar 
                animated 
                className={VoteBarStyles.agree}
                variant="success" 
                now={agreePercentage} 
                label={`${Math.round(agreePercentage)}%`} 
                key={1} 
            />
            <ProgressBar 
                animated 
                className={VoteBarStyles.disagree}
                variant="danger" 
                now={disagreePercentage} 
                label={`${Math.round(disagreePercentage)}%`} 
                key={2} 
            />
        </ProgressBar>
        </>
    )
}

export default VoteBar;
