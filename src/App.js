import React, { Component } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import appStyle from "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import Home from "./components/home.component";
import Navbar from "./components/navbar.component";
import ForgotPassword from "./components/forgotPassword.component";
import SubmitDebate from "./components/submitDebate.admin.component";
import { AuthProvider } from "./Auth.js";
import PrivateRoute from "./PrivateRoute.js";
import UsernameEntry from "./components/usernameEntry.component.js";
import NotVerified from "./components/notVerified.component.js";
import DebatePage from "./components/debatePage.component.js";
import Footer from "./components/footer.component.js";

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     user: {},
  //   }
  // }

  // componentDidMount() {
  //   this.authListener();
  // }

  // authListener() {
  //   firebaseAppInit.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       this.setState({user});
  //     }
  //     else {
  //       this.setState({ user: null });
  //     }
  //   });
  // }

  render() {
    return (
      <AuthProvider>
        <Router>
          <Navbar />

          <div className="body">
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <PrivateRoute
                exact
                path="/not-verified"
                component={NotVerified}
              />
              <PrivateRoute
                exact
                path="/submit-debate"
                component={SubmitDebate}
              />
              <PrivateRoute exact path="/debate-page" component={DebatePage} />
              <Route exact path="/sign-in" component={Login} />
              <Route exact path="/sign-up" component={SignUp} />
              <PrivateRoute
                exact
                path="/sign-up/choose-a-username"
                component={UsernameEntry}
              />
              <Route exact path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </div>

          <div className={appStyle.Footer}>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
