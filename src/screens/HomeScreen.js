import Fade from 'react-reveal/Fade'
import Navbar from '../components/Navbar'
import React from 'react'

const HomeScreen = () => {
  return (
    <div className='main-screen'>
      <Navbar active='Home'></Navbar>
      <div className='screen-body'>
        <Fade left>
          <div className='welcome-container'>
            <h2 style={{ color: '#6C63FF' }}>Jourdan&nbsp;</h2>
            <h2 style={{ color: 'white' }}>Dunkley</h2>
            <br></br>
            <br></br>
            <h2 style={{ color: '#6C63FF' }}>
              Full <span style={{ color: 'white' }}>Stack</span> Developer<span style={{ color: 'white' }}>.</span>
            </h2>
            <br></br>
            <p>Frontend / Backend / Smart Contracts</p>
          </div>
        </Fade>

        {/* <img
          className='blue-ball floating-2'
          src='./images/blue-ball.svg'
          alt='blue-ball'
        ></img>
        <img
          className='purple-ball floating-2'
          src='./images/purple-ball.svg'
          alt='purple-ball'
        ></img>
        <img
          className='pink-ball floating'
          src='./images/pink-ball.svg'
          alt='pink-ball'
        ></img>
        <img
          className='yellow-ball floating'
          src='./images/yellow-ball.svg'
          alt='yellow-ball'
        ></img> */}
      </div>
    </div>
  )
}

export default HomeScreen
