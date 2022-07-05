import './App.css'

import { Route, HashRouter as Router } from 'react-router-dom'

import AboutScreen from './screens/AboutScreen'
import ContactScreen from './screens/ContactScreen'
import ExperienceScreen from './screens/ExperienceScreen'
import HomeScreen from './screens/HomeScreen'
import ProjectScreen from './screens/ProjectScreen'

function App() {
  return (
    <Router>
      <Route path='/' exact component={HomeScreen}></Route>
      <Route path='/about' component={AboutScreen} exact></Route>
      <Route path='/skills' component={ExperienceScreen}></Route>
      <Route path='/contact' component={ContactScreen}></Route>
      <Route path='/projects' component={ProjectScreen}></Route>
    </Router>
  );
}

export default App;
