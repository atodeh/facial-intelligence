import React from 'react';
import Popup from 'react-popup';
import './Signin.css';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: ''
    }
  }

  //this function will listen to see if user hits enter key to sign in
  onEnterPress = (event) => {
    if (event.key === 'Enter') {
      this.onSubmitSignIn();
    }
  }

  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value});
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value});
  }

  onSubmitSignIn = () => {
    /*By default, fetch uses GET, so we can change to
    POST using the second parameter as show below here */
    fetch('https://pure-shore-49646.herokuapp.com/signin', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    })
      .then(response => response.json())
      .then(user => {
        if (user.id) {
          this.props.loadUser(user);
          this.props.onRouteChange("homePage");
        } else if (user === 'invalid password') {
          Popup.alert("The password you entered is incorrect");
        } else {
          Popup.alert("The email address does not exist");
        }
      })
  }

  render() {
    const { onRouteChange } = this.props; //in order to use props, it needs to be passed in the constructor above
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input onKeyDown={this.onEnterPress} onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 bord" type="email" name="email-address"  id="email-address" />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input onKeyDown={this.onEnterPress} onChange={this.onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 bord" type="password" name="password"  id="password" />
              </div>
            </fieldset>
            <div>
              <input onClick={this.onSubmitSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dib onHover" type="submit" value="Sign in" />
            </div>
            <div className="lh-copy mt3">
              {/*With the onClick event listener below, we only want the function called when the button is
              clicked on, so we use arrow function syntax to ensure the function is not run before clicked*/}
              <p onClick={() => onRouteChange("registerPage")} href="#0" className="f4 link dim black db pointer">Register</p>
            </div>
          </div>
        </main>
      </article>
  ); 
  }
}

export default Signin;