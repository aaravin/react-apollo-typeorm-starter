import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import logo from './logo.svg';
import './App.css';

const HELLO_TEST = gql`
  {
    hello
  }
`;

function App() {
  const { data } = useQuery(HELLO_TEST);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {data && data.hello}
        </a>
      </header>
    </div>
  );
}

export default App;
