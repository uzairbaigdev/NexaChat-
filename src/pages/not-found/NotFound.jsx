import React from 'react'
import './notfound.css'
import notFoundImg from '../../assets/notFoundImg.png'

let NotFound = () => {
  return (
    <>
      <div className="parent-div">


        <div className="error-text">
          <h1 className='error-code'>404</h1>
          <h2>Oops! Page Not Found...</h2>
          <h3>The page you're looking for doesn't exist or has been moved.</h3>
        </div>

        <div className='img-div'>
          <img src={notFoundImg} alt="Not Found" />
        </div>
      </div>
    </>

  )
}

export default NotFound