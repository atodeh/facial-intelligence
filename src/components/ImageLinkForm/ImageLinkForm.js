import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
      <p className="f3">
        {'This intelligent brain will detect faces in your pictures!'}
      </p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input className="center f4 pa2 w-70" type="text" onChange={onInputChange}/>
          <button className="w-30 grow f4 link ph3 pv2 dib white bg-light-red" onClick={onButtonSubmit}>Detect!</button>
        </div>
      </div>
    </div>
  );
}

export default ImageLinkForm;