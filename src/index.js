import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from 'react-moralis';
import Moralis from 'moralis';



const serverUrl = "https://j7rgyutefndj.usemoralis.com:2053/server" 
const appId = "QWhlmPWpPCxgM4XbtNysag7vKF3PcOtyyGXXf0rb" 
Moralis.start({ serverUrl, appId});


ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider serverUrl="https://j7rgyutefndj.usemoralis.com:2053/server" appId="QWhlmPWpPCxgM4XbtNysag7vKF3PcOtyyGXXf0rb">
      <App />
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
  
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
