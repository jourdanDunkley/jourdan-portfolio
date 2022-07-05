import React, { useState } from 'react'

import Fade from 'react-reveal/Fade'
import Navbar from '../components/Navbar'
import dotenv from 'dotenv'
import emailjs from 'emailjs-com'

const ContactScreen = () => {
  dotenv.config()
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    emailjs
      .sendForm(
        'gmail',
        process.env.REACT_APP_TEMPLATE_ID,
        e.target,
        process.env.REACT_APP_USER_ID
      )
      .then(
        (result) => {
          console.log(result.text)
          setSent(true)
        },
        (error) => {
          console.log(error.text)
        }
      )
  }
  return (
    <div className='main-screen'>
      <Navbar active='Contact'></Navbar>
      <div className='screen-body'>
        <Fade left>
          <div className='contact-wrapper'>
            <div>
              <h2 className='header-text' style={{ color: '#6C63FF' }}>
                Contact
              </h2>{' '}
              &nbsp;
              <h2 className='header-text' style={{ color: 'white' }}>
                me.
              </h2>
            </div>

            <div className='contact-form-container'>
              <form onSubmit={onSubmit}>
                <textarea 
                  name='name' 
                  placeholder='Name'>
                </textarea>
                <br></br>
                <textarea
                  name='email'
                  type='email'
                  placeholder='Email'
                ></textarea>
                <br></br>
                <textarea
                  placeholder='Message'
                  className='message-area'
                  name='message'
                ></textarea>
                {sent && <p>Message has been sent!</p>}
                <button
                  style={{
                    marginRight: '5%',
                    fontSize: '1rem',
                    marginTop: '2%',
                    float: 'right',
                  }}
                  type='submit'
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </Fade>
      </div>
    </div>
  )
}

export default ContactScreen
