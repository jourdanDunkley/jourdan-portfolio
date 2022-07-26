import Fade from 'react-reveal/Fade'
import Navbar from '../components/Navbar'
import React from 'react'

const ExperienceScreen = () => {
  return (
    <div className='main-screen'>
      <Navbar active='Experience'></Navbar>
      <div className='screen-body'>
        <Fade left>
          <div className='experience-container'>
            <div className='experience-text-wrapper'>
              <h2 style={{ color: '#6C63FF' }}>Technical</h2> &nbsp;
              <h2 style={{ color: 'white' }}>
                Skills<span style={{ color: 'white' }}>.</span>
              </h2>
              <div className='experience-text'>
                <h3 style={{ color: '#6C63FF' }}>Front-end</h3>
                <p>React | Next.js | Flutter | Android</p>
                <h3 style={{ color: '#6C63FF' }}>Back-end</h3>
                <p>Express.js | Node.js | PostgreSQL | MongoDB</p>
                <h3 style={{ color: '#6C63FF' }}>Other</h3>
                <p>Java | Solidity | Go</p>
              </div>
            </div>
          </div>
        </Fade>
      </div>
    </div>
  )
}

export default ExperienceScreen
