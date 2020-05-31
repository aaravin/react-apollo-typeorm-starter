import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import './HomePage.css';

const HELLO = gql`
  {
    hello
  }
`;

const HomePage = () => {
  const { data } = useQuery(HELLO);
  return (
    <div className='HomePage'>
      Welcome, {data && data.hello}
    </div>
  );
}

export default HomePage;