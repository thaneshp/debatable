import React, { useEffect, useState, useContext } from "react";
import { withRouter, Redirect } from 'react-router'
import { firestore } from "firebase";
import { AuthContext } from '../Auth.js'

import DebateCard from './debateCard.component';

// import Footer from './footer.component';

const Home = ({ history }) => {
    const [debates, setDebates] = useState(null);

    useEffect(() => {
        const db = firestore();
        db.collection("debates")
          .get() 
          .then(snapshot => {
              const debates = []
              snapshot.forEach(doc => {
                  const data = doc.data()
                  //Add the debate id into the data object.
                  data.id = doc.id;
                  debates.push(data);
              })
              setDebates(debates)
          }).catch(error => {
              //console.log(error)
          });
    }, [])

    const { currentUser } = useContext(AuthContext);

    if (!currentUser.emailVerified) {
        return <Redirect to="/not-verified" />;
    }

    return (
        <div>
        
        <h1>Debates</h1>
        {/* <Scroll> */}
        {
            debates &&
            debates.map(debate => {
                return (
                    <DebateCard 
                        user={debate.user} 
                        title={debate.title} 
                        description={debate.description} 
                        imageUrl={debate.image} 
                        debateID={debate.id}
                        noOfVotes={debate.no_of_votes}
                        noOfAgreeVotes={debate.no_of_agree_votes}
                        noOfDisagreeVotes={debate.no_of_disagree_votes}
                        dateSubmitted={debate.dateSubmitted.toDate()}
                    />
                )
            })
        }
        {/* </Scroll> */}
        </div>
    )
}

export default withRouter(Home)