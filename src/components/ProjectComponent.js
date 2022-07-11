import Fade from 'react-reveal/Fade'
import React from 'react'

const ProjectComponent = ({
  name,
  description,
  skills,
  image,
  demo,
  github,
}) => {
  return (
    <Fade up>
      <div className='single-project-container'>
        <h3>{name}</h3>
        <div className='single-project-text'>
          <img className='thumb-img' src={image} alt='thumbnail'></img>
          <p>{description}</p>          
        </div>
        <div className='skills-container'>
          <span>{skills} </span>
          <div className='icon-container'>
            {github && (
              <a href={github}>
                <img
                  className='filter'
                  src={process.env.PUBLIC_URL + '/images/icons/github-gray.svg'}
                  alt='github-gray'
                ></img>
              </a>
            )}
            {!github && (
              <a style={{ cursor: 'not-allowed' }}>
                <img src={process.env.PUBLIC_URL + '/images/icons/github-red.svg'} alt='github-red'></img>
              </a>
            )}
            {demo && (
              <a href={demo}>
                <img
                  className='filter'
                  src={process.env.PUBLIC_URL + '/images/icons/code.svg'}
                  alt='demo'
                ></img>
              </a>
            )}
            {!demo && (
              <a style={{ cursor: 'not-allowed' }}>
                <img src={process.env.PUBLIC_URL + '/images/icons/code-red.svg'} alt='demo-red'></img>
              </a>
            )}
          </div>
        </div>
      </div>
    </Fade>
  )
}

export default ProjectComponent
