import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img src={imageUrl} id="inputimage" alt="" width="500px" height="auto"/>
        {
          box.map((item, index) => {
            const { topRow, rightCol, bottomRow, leftCol } = item; //destructuring
            return <div key={index} className="bounding-box" style={{top: topRow, right: rightCol, bottom: bottomRow, left: leftCol}}></div>
          })
        }
      </div>     
    </div>
  );
}

export default FaceRecognition;