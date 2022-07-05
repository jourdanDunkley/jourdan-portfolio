import { LinkContainer } from 'react-router-bootstrap'
import React from 'react'

const Navbar = ({ active }) => {
  return (
    <div className='nav-wrapper'>
      <div className='side-nav'>
        <div
          className={
            active === 'Home' ? 'nav-element active-header' : 'nav-element'
          }
        >
          <LinkContainer to='/'>
            <img src='./images/icons/home.svg' alt='home'></img>
          </LinkContainer>
          <LinkContainer to='/'>
            <h2>Home</h2>
          </LinkContainer>
        </div>
        <div
          className={
            active === 'About' ? 'nav-element active-header' : 'nav-element'
          }
        >
          <LinkContainer to='/about'>
            <img src='./images/icons/about.svg' alt='about'></img>
          </LinkContainer>
          <LinkContainer to='/about'>
            <h2>About</h2>
          </LinkContainer>
        </div>
        <div
          className={
            active === 'Experience'
              ? 'nav-element active-header'
              : 'nav-element'
          }
        >
          <LinkContainer to='/skills'>
            <img src='./images/icons/skills.svg' alt='skills'></img>
          </LinkContainer>
          <LinkContainer to='/skills'>
            <h2>Skills</h2>
          </LinkContainer>
        </div>
        <div
          className={
            active === 'Projects' ? 'nav-element active-header' : 'nav-element'
          }
        >
          <LinkContainer to='/projects'>
            <img src='./images/icons/projects.svg' alt='projects'></img>
          </LinkContainer>

          <LinkContainer to='/projects'>
            <h2>Projects</h2>
          </LinkContainer>
        </div>

        <div
          className={
            active === 'Contact' ? 'nav-element active-header' : 'nav-element'
          }
        >
          <LinkContainer to='/contact'>
            <img src='./images/icons/contact.svg' alt='contact'></img>
          </LinkContainer>

          <LinkContainer to='/contact'>
            <h2>Contact</h2>
          </LinkContainer>
        </div>
      </div>
      {/* <div className='media-container'>
        <a href='/portfoliov1/#/contact'>
          <img src='./images/icons/footer-mail.svg' alt='mail'></img>
        </a>
        <a href='https://www.linkedin.com/in/anthony-oliai-52315118b/'>
          {' '}
          <img src='./images/icons/linkedin.svg' alt='linkedin'></img>
        </a>
        <a href='https://github.com/anthonyoliai'>
          {' '}
          <img src='./images/icons/github.svg' alt='github'></img>
        </a>
      </div> */}
      {/* <div></div> */}
    </div>
  )
}

export default Navbar
