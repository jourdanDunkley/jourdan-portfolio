import Bounce from "react-reveal/Bounce";
import Fade from "react-reveal/Fade";
import Navbar from "../components/Navbar";
import React from "react";

const AboutScreen = () => {
  return (
    <div className="main-screen">
      <Navbar active="About"></Navbar>
      <div className="screen-body">
        <Fade left>
          <div className="about-container">
            <div className="about-text">
              <h2 style={{ color: "#6C63FF" }}>About</h2> &nbsp;
              <h2 style={{ color: "white" }}>me.</h2>
              <p>
                I&apos;m Jourdan - A passionate fullstack developer from
                Jamaica, and graduate of the University of the West Indies.
              </p>
              <p>
                I am a self-motivated, independent learner and avid enthusiast
                of Blockchain Technology. I&apos;ve spent a lot of time in the
                Crypto/NFT space learning the technology and the possibilities
                it has for the future, and I&apos;ve applied my knowledge and
                skills of both project management and development to my own
                projects, and worked with leaders in the Web 3 space on some of
                the largest DAPPS.
              </p>
              <a
                href="https://docs.google.com/document/d/1EFvz8MOTx-MLJ9DtJNwGkMZBGKvtoJSBpc5yvH0GHC0/edit?usp=sharing"
                target="_blank"
              >
                <button style={{ width: "50%" }}>View CV</button>
              </a>
            </div>
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default AboutScreen;
