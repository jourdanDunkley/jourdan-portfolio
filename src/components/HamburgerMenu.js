import { LinkContainer } from 'react-router-bootstrap'
import React, { useState } from 'react'
import { HiOutlineMenu } from 'react-icons/hi'
import { IoCloseOutline } from 'react-icons/io5'
import { slide as Menu } from 'react-burger-menu';
import Fade from 'react-reveal/Fade'

export const HamburgerMenu = ({ active }) => {

    const [open, setOpen] = useState(false);

    const hamburgerIcon = <HiOutlineMenu className='hamburger'
        size='40px' color='white'
        onClick={() => { setOpen(!open) }}
    />

    const closeIcon = <IoCloseOutline className='hamburger'
        size='40px' color='white'
        onClick={() => { setOpen(!open) }}
    />

    return (
        <div className='mobile-nav'>
            {/* {open ? closeIcon : hamburgerIcon} */}
            <Menu right isOpen={open}>
                <div
                    className={
                        active === 'Home' ? 'nav-element active-header' : 'nav-element'
                    }
                    style={{display: 'flex'}}
                >
                    <LinkContainer to='/'>
                        <img src={process.env.PUBLIC_URL + '/images/icons/home.svg'} alt='home'></img>
                    </LinkContainer>
                    <LinkContainer to='/'>
                        <h2>Home</h2>
                    </LinkContainer>
                </div>
                <div
                    className={
                        active === 'About' ? 'nav-element active-header' : 'nav-element'
                    }
                    style={{display: 'flex'}}
                >
                    <LinkContainer to='/about'>
                        <img src={process.env.PUBLIC_URL + '/images/icons/about.svg'} alt='about'></img>
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
                    style={{display: 'flex'}}
                >
                    <LinkContainer to='/skills'>
                        <img src={process.env.PUBLIC_URL + '/images/icons/skills.svg'} alt='skills'></img>
                    </LinkContainer>
                    <LinkContainer to='/skills'>
                        <h2>Skills</h2>
                    </LinkContainer>
                </div>
                <div
                    className={
                        active === 'Projects' ? 'nav-element active-header' : 'nav-element'
                    }
                    style={{display: 'flex'}}
                >
                    <LinkContainer to='/projects'>
                        <img src={process.env.PUBLIC_URL + '/images/icons/projects.svg'} alt='projects'></img>
                    </LinkContainer>

                    <LinkContainer to='/projects'>
                        <h2>Projects</h2>
                    </LinkContainer>
                </div>

                <div
                    className={
                        active === 'Contact' ? 'nav-element active-header' : 'nav-element'
                    }
                    style={{display: 'flex'}}
                >
                    <LinkContainer to='/contact'>
                        <img src={process.env.PUBLIC_URL + '/images/icons/contact.svg'} alt='contact'></img>
                    </LinkContainer>

                    <LinkContainer to='/contact'>
                        <h2>Contact</h2>
                    </LinkContainer>
                </div>

                <div
                    className={
                        active === 'Game' ? 'nav-element active-header' : 'nav-element'
                    }
                    style={{display: 'flex'}}
                >
                    <LinkContainer to='/game'>
                        <img src={process.env.PUBLIC_URL + '/images/icons/controller.svg'} alt='contact'></img>
                    </LinkContainer>

                    <LinkContainer to='/game'>
                        <h2>Game</h2>
                    </LinkContainer>
                </div>
            </Menu>
        </div>
    )
}
