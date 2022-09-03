import React, { useContext, useState } from "react";
import { firestore} from "firebase";
import firebaseAppInit from "../config/firebase.js";
import { AuthContext } from '../Auth.js'
import './submitDebate.css';

const SubmitDebateAdmin = ({}) => {
    const { currentUser } = useContext(AuthContext);
    const [debate, setDebate] = useState('');
    const [description, setDescription] = useState('');
    const [uid, setUID] = useState('');
    const [debateError, setDebateError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [chkbox, setChkbox] = useState(false);
    const [fileName, setFileName] = useState('Choose an Image...');
    const [fileUrl, setFileUrl] = useState(null);
    const [sumbitedDebate, setSubmitedDebate] = useState(false);
    let username = ''
   
    //Function used to clear form fields.
    const clearForm = () => {
        setDebate ('')
        setDescription('')
        setDebateError('')
        setDescriptionError('')
        setUID('')
    }

    //Function used to retrieve username field and submit input.
    const getUsername = (uid) => {
        const db = firestore();     
        var docRef = db.collection("debaters").doc(uid);

        docRef.get().then((doc) => {
            if (doc.exists) {
                username = doc.data().username
            } else {
                // doc.data() will be undefined in this case
                //console.log("No such document!");
            }
        }).then(() => {
            createNewSubmissionDocument()
        }).catch(function(error) {
            //console.log("Error getting document:", error);
        });
    }

    //Function write created submission to firebase database.
    const createNewSubmissionDocument = () => {
        const db = firestore();
        //console.log(fileUrl);
        db.collection("debates").doc().set({
            title: debate,
            description: description,
            uid: currentUser.uid,
            user: username,
            dateSubmitted: firestore.Timestamp.now(),
            shareUser: chkbox,
            image: fileUrl
        })
        .then(() => {
            //console.log("Document successfully written!");
            clearForm(); 
            setSubmitedDebate(true) 
        })
        .catch((error) => {
            //console.error("Error writing document: ", error);
            alert(error)
        });
    }

    //Helper function to upload image to firebase.
    const onFileChange = async (e) => {
        const file = e.target.files[0];
        const storageRef = firebaseAppInit.storage().ref();
        const fileRef = storageRef.child(file.name);
        await fileRef.put(file);
        setFileUrl(await fileRef.getDownloadURL());
        setFileName(file.name);
    }
    
    const submitHandler = (e) => {
        e.preventDefault();
        
        if (formValidate()) {
            getUsername(uid)
        }
    };

    //Helper function to validate form fields.
    const formValidate = () => {
        let returnVal = true

        if (debate == '' ) {
            returnVal = false
            setDebateError("Please provide a debate title")
        }

        if (description == '') {
            returnVal = false
            setDescriptionError("Please provide a description")
        }
        return returnVal
    }

    
    return (

    
        <div className="auth-wrapper">
            
            <div className="auth-inner">
            <form>
            <h3>Admin Create Debate</h3>

            <div className="form-group">
                <label>Debate</label>
                <input 
                    value={debate} 
                    onChange={e => setDebate(e.target.value) }
                    className="form-control" 
                    placeholder="Debate"        
                />
                <small>{debateError}</small>
            </div>

            <div className="form-group">
                <label>UID</label>
                <input 
                    value={uid} 
                    onChange={e => setUID(e.target.value) }
                    className="form-control" 
                    placeholder="UID"        
                />
                <small>{debateError}</small>
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="form-control" 
                        placeholder="Description"
                        as="textarea"  
                    />
                <small>{descriptionError}</small>
            </div>

            

            <label>Debate Image</label>
            <div class="input-group">
                <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroupFileAddon01">Upload</span>
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
                <label class="custom-file-label" for="inputGroupFile01">{fileName}</label>
            </div>
            </div>

            <button type="submit" onClick={submitHandler} className="btn btn-primary btn-block">Submit</button>
            
            </form>
            </div>  
        </div>
    )  
};


export default SubmitDebateAdmin;