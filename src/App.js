import "./App.css";

import { Route, HashRouter as Router } from "react-router-dom";

import AboutScreen from "./screens/AboutScreen";
import ProjectScreen from "./screens/ProjectScreen";
import ContactScreen from "./screens/ContactScreen";
import ExperienceScreen from "./screens/ExperienceScreen";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";

function App() {
  return (
    <Router>
      <Route path="/" exact component={HomeScreen}></Route>
      <Route path="/about" component={AboutScreen} exact></Route>
      <Route path="/projects" component={ProjectScreen}></Route>
      <Route path="/skills" component={ExperienceScreen}></Route>
      <Route path="/contact" component={ContactScreen}></Route>
      <Route path="/game" component={GameScreen}></Route>
    </Router>
  );
}

export default App;
