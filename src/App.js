import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig); //initialize firebase


function App() {

  const provider = new firebase.auth.GoogleAuthProvider(); //google sign in

  const[user,setUser] =useState({   //sign in state
    isSignIn :false,
    name:'',
    email:'',
    photo:'',
    password:''
  })

  //sign in activity
  const onClickSignIn =()=>{
    //console.log("click");
    firebase.auth().signInWithPopup(provider)
    .then(result =>{
      console.log(result);
      const {displayName,email,emailVerified,phoneNumber,photoURL} =result.user; //destructuring
      console.log("Name :",displayName,"Email:",email,"Email Verified:",emailVerified,"PhoneNumber:",phoneNumber);
    
      const confirmSignIn ={
        isSignIn :true,
        name:displayName,
        email:email,
        photo:photoURL
      }

      setUser(confirmSignIn);//sign is state set
    
    
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      console.log(errorCode);
      var errorMessage = error.message;
      console.log(errorMessage);
      // The email of the user's account used.
      var email = error.email;
      console.log(email);
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log(credential);
      // ...
    });
    

  }

  //sign out activity
  const onClickSignOut = () => {

    
    firebase.auth().signOut()
    .then(function() {
      // Sign-out successful.
      const confirmSignOut = {
        isSignIn :false,
        name:'',
        email:'',
        photo:'',
        error:'',
        isValid:false,
        existingUser:false
      }
  
      setUser(confirmSignOut);

    })
    .catch(function(error) {
      // An error happened.
    });
    
        
  } 

  //const nn = "SAMPAD";

  // document.getElementById("signOut").addEventListener("onClick",function(){
  //   document.getElementById("signOutMessage").style.display="block";
  // })


  //email validation using regular expression
  const is_valid_email =email=>/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)


  //password validation checking has any number in password
  const hasNumber = passwordValue =>/\d/g.test(passwordValue);

  //checkbox function
  const switchForm = event => {
    const createdUser = {...user};
    createdUser.existingUser = event.target.checked;
  
    setUser(createdUser);
  }






  //submit button function activity
  const getOnBlurValue=(event)=>{
    //console.log(event.target.value);

    const newUserInfo = {   //adding new properties in useState
      ...user,
      //[event.target.name] : event.target.value   //adding new properties in useState
    };

    //check email validation
    let isValid = true;
    if (event.target.name ==="email") {
      //console.log(is_valid_email(event.target.value));
      isValid = is_valid_email(event.target.value);
    }


    //check password
    if(event.target.name==="password"){
      isValid = event.target.value.length > 8 && hasNumber(event.target.value);
    }
    
    
    newUserInfo[event.target.name] = event.target.value;

    newUserInfo.isValid = isValid;  //
    setUser(newUserInfo);//adding new properties in useState

  }
  
  
  //submit button create new user with email and password 
  const onClickSubmit =(event)=> {
    //console.log("clicked submit");
    //console.log("Email:",user.email,"Password:",user.password,"isValid:",user.isValid);
    
    if (user.isValid) {
      // console.log("Email:",user.email,"Password:",user.password);
      // console.log(user.isSignIn);
      firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
      .then(res => {
        console.log(res);

        const createdUser = {...user};
        createdUser.isSignIn = true;
        createdUser.error='';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err);

        const createdUser = {...user};
        createdUser.isSignIn = false;
        createdUser.error = err.message;

        setUser(createdUser);
      })

      

    }
    else{
      console.log("Something wrong");
    }

    event.preventDefault();  //prevent reload browser

    event.target.reset();  //reset form field
  }


  //sign in user with  email and password
  const SignInUser = event => {

    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
      .then(res => {
        console.log(res);

        const createdUser = {...user};
        createdUser.isSignIn = true;
        createdUser.error='';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err);

        const createdUser = {...user};
        createdUser.isSignIn = false;
        createdUser.error = err.message;

        setUser(createdUser);
      })
    
    event.preventDefault();  //prevent reload browser
    event.target.reset();  //reset form field
  }
 
  return (
    <div>

      <div className="App-header">
        {/* condition signIn and signOut
        signIn and signOut by google account info */}

        {
          user.isSignIn ? <button id="signOut" onClick={onClickSignOut}>Sign Out</button> :
                          <button onClick={onClickSignIn}>Sign in</button>
        }
         
        {/* when issignIn true show the welcome message */}
        
        {
          user.isSignIn && <div style={{textAlign:"center"}}>
                              <h4>Welcome,{user.name} </h4>
                              <p>{user.email}</p>
                              <img src={user.photo} alt=""/>
                            </div>
             
        }


        
        {/* <div id="signOutMessage">
         <h4>Thank You</h4>
        </div> */}

          <br/><br/>
           {/* checkbox  */}
          <label htmlFor="switchForm">
          <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
          Current User</label>
          
         {/* sign in with email and password */}
        <form style={{display:user.existingUser?"block":"none"}} onSubmit={SignInUser}>
          <h4>SignIn account</h4>
          <input type="email" name="email" onBlur={getOnBlurValue} placeholder='Email address' required/>
          <br/>
          <input type="password" name="password" onBlur={getOnBlurValue} placeholder="Password" required/>
          <br/>
          <input type="submit" value="SignIn"/>
          
          
        </form>   
          
        {/* create new account with email and pasword */}
        <form style={{display:user.existingUser?"none" : "block"}} onSubmit={onClickSubmit}>
          <h4>SignUp(Create Account) with Email-Password</h4> 
          <input type="text" name="name" onBlur={getOnBlurValue} placeholder='Your name' required/>
          <br/>
          <input type="email" name="email" onBlur={getOnBlurValue} placeholder='Email address' required/>
          <br/>
          <input type="password" name="password" onBlur={getOnBlurValue} placeholder="Password" required/>
          <br/>
          <input type="submit" value="submitPlz"/>
          
         
        
          
        </form> 

        {/* error message show   */}
        {
          user.error && <p style={{color:"red"}}>{user.error}</p>
        }
        
      
      </div>



      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}


      
    </div>
  );
}

export default App;
