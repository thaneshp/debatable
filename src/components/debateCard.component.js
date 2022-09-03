import React, { useCallback } from "react";
import debateCardStyles from './debateCard.module.scss'
import { useHistory } from 'react-router-dom'
import { BsPeopleFill} from "react-icons/bs";
import { BsPersonFill} from "react-icons/bs";
import { IconContext } from "react-icons";
import ReactTimeAgo from 'react-time-ago'

//Destructing as part of the parameter
const DebateCard = ({ user, title, description, imageUrl, debateID, noOfVotes, noOfAgreeVotes, noOfDisagreeVotes, dateSubmitted }) => {
    
    const history = useHistory();

    const handleOnClick = useCallback(
        () => {
            history.push({
                pathname: '/debate-page',
                data: { user, title, description, imageUrl, debateID, noOfVotes, noOfAgreeVotes, noOfDisagreeVotes, dateSubmitted}
            });
        },
        [history, user, title, description, imageUrl, debateID, noOfVotes, noOfAgreeVotes, noOfDisagreeVotes, dateSubmitted],
    )

    return (
        <div onClick={handleOnClick} className={debateCardStyles.wrapper}>
            <div className={debateCardStyles.inner}>
                <div className={debateCardStyles.content}>
                    <h6 className={debateCardStyles.username}>{user}</h6>
                    <h2>{title}</h2>
                    <p>{description}</p>
                    {/* <p>{dateSubmitted}</p> */}
                    <IconContext.Provider value={{color: "rgb(101, 103, 107)", size: 25, style: { verticalAlign: 'center', marginRight: '10px', marginTop: '-5px'}, className: "global-class-name" }}>
                    {(noOfVotes !== 1) ? 
                        (<p className={debateCardStyles.numVotes}><BsPeopleFill/>{noOfVotes} voters</p>) 
                    :
                        (<p className={debateCardStyles.numVotes}><BsPersonFill/>{noOfVotes} voter</p>)
                    } 
                    </IconContext.Provider>
                </div>
                <h6 className={debateCardStyles.time}><ReactTimeAgo date={dateSubmitted} locale="en-US"/></h6>
                {/* {imageUrl? */}
                {/* (<div className={debateCardStyles.image}> */}
                    {/* <img src={imageUrl} /> */}
                {/* </div>) */}
                {/* : */}
                {/* (<></>)} */}
            </div>
        </div>
    );
}

export default DebateCard;