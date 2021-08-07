import React from 'react';
import Popup from 'react-popup';
import Navigation from '../components/Navigation/Navigation';
import Logo from '../components/Logo/Logo';
import Rank from '../components/Rank/Rank';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';
import Signin from '../components/Signin/Signin';
import Register from '../components/Register/Register';
import Particles from 'react-particles-js'; //allows us to use installed particles
import './App.css';

//this particles object (properties + values) defines the particles used
const particlesOptions = {
  particles: {
    number: {
      value: 20,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: [],
  route: 'signinPage',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

//the main App component begins here
class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  //this function will load all user info, and change state upon signin
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  //this function will calculate where we want our face recognition boxes drawn
  calculateFaceLocation = (data) => {
    const clarifaiFaceArray = data.outputs[0].data.regions.map(item => item.region_info.bounding_box);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return clarifaiFaceArray.map(item => {
      return {
        leftCol: item.left_col * width,
        topRow: item.top_row * height,
        rightCol: width - (item.right_col * width),
        bottomRow: height - (item.bottom_row * height)
      }
    })
  }

  //this function will set the state of the "box" array, with objects containing our box location data
  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  //this function will control the searchbox in the ImageLinkForm component
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  //this function will control the "Detect!" button in the ImageLinkForm component
  onButtonSubmit = () => {
    let message = false; //caps potential error message at 1
    this.setState({imageUrl: this.state.input});
    fetch('https://pure-shore-49646.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response.outputs[0].data.regions) {
        fetch('https://pure-shore-49646.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(data => {
          const cloneUser = {...this.state.user}; //we need to create a clone of the user object
          cloneUser.entries = data; //data from the backend will be assigned to the entries property in the cloned object
          this.setState({user: cloneUser}); //the user object will now be updated to the cloned object
        })    
      } else {
        this.setState({box: []})
        message = true; //ensures the following popup alert will be the only error
        Popup.alert("No faces have been detected"); //in case a valid image is submitted, but no faces detected
        }
      /*takes the response from Clarifai API, and passes it through calculateFaceLocation()
      and then displayFaceBox() in order calculate where the face boxes should be drawn*/
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(error => {
      //checks to make sure no other error messages have appeared
      if (!message) {
        Popup.alert("Please enter a valid image url"); //in case clarifai api fails
      }
    }); 
  }

  //this function will help us control what page our app is displaying
  onRouteChange = (page) => {
    if (page === 'signinPage') {
      this.setState(initialState);
    } else if (page === 'homePage') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: page});
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Popup />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {/*We are using ternary operators in order to determine where we are on the page
        When our app/constructor first loads, we want to be on the signin page*/}
        { this.state.route === 'homePage'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div>
          : (
            this.state.route === 'signinPage'
            ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          )    
        }
      </div>
    )
  }
}

export default App;