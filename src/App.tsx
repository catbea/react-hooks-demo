/**
 * @name App
 * @author Lester
 * @date 2021-05-19 19:24
 */

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from 'src/layout/Layout';
import Context from 'src/store';

const App: React.FC = () => {
  return (
    <Context>
      <Router basename="/tenacity-webapp-b">
        <Layout />
      </Router>
    </Context>
  );
};

export default App;
