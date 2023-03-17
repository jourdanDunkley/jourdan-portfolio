import Fade from "react-reveal/Fade";
import Navbar from "../components/Navbar";
import React from "react";

const HomeScreen = () => {
  return (
    <div className="main-screen">
      <Navbar active="Home"></Navbar>
      <div className="screen-body">
        <Fade left>
          <div className="welcome-container">
            <h2 style={{ color: "#6C63FF" }}>Jourdan&nbsp;</h2>
            <h2 style={{ color: "white" }}>Dunkley</h2>
            <br></br>
            <br></br>
            <h2 style={{ color: "#6C63FF" }}>
              Blockchain<span style={{ color: "white" }}> Developer</span>
              <span style={{ color: "white" }}>.</span>
            </h2>
            <br></br>
            <p>Smart Contracts | Frontend | Backend</p>
            <a href="https://jourdandunkley.github.io/jourdan-portfolio/#/contact">
              <button style={{ width: "50%", marginTop: "3rem" }}>
                Contact Me
              </button>
            </a>
          </div>
        </Fade>

        <img
          className="blue-ball floating-3"
          src={process.env.PUBLIC_URL + "/images/purple-ball.svg"}
          alt="blue-ball"
        ></img>
        <img
          className="purple-ball floating-2"
          src={process.env.PUBLIC_URL + "/images/Ethereum-logo.png"}
          alt="purple-ball"
        ></img>
        <img
          className="pink-ball floating"
          src={process.env.PUBLIC_URL + "/images/polygon-matic-logo.png"}
          alt="pink-ball"
        ></img>
        {/* <img
          className="yellow-ball floating"
          src={process.env.PUBLIC_URL + "/images/polygon-matic-logo.png"}
          alt="yellow-ball"
        ></img> */}
      </div>
    </div>
  );
};

export default HomeScreen;
