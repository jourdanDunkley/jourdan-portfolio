import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from 'react-moralis';
import Moralis from 'moralis';



const serverUrl = "https://j7rgyutefndj.usemoralis.com:2053/server" 
const appId = "RHQyAj4tUd1OUpIgxqSreaiHudZil1OSxA0EqGm2" 
Moralis.start({ serverUrl, appId});


ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider serverUrl="https://mgrqnm3n2mpk.usemoralis.com:2053/server" appId="RHQyAj4tUd1OUpIgxqSreaiHudZil1OSxA0EqGm2">
      <App />
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
  
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
