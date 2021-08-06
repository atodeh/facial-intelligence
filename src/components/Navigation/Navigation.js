import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {
    if (isSignedIn) {
      return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
          {/*With the onClick event listener below, we only want the function called when the button is
          clicked on, so we use arrow function syntax to ensure the function is not run before clicked*/}
          <p onClick ={() => onRouteChange("signinPage")} className="f3 link dim black underline pa3 pointer">Sign Out</p>
        </nav>
      );
    } else {
      return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
          <p onClick ={() => onRouteChange("signinPage")} className="f3 link dim black underline pa3 pointer">Sign In</p>
          <p onClick ={() => onRouteChange("registerPage")} className="f3 link dim black underline pa3 pointer">Register</p>
        </nav>
      );
    }
}

export default Navigation;