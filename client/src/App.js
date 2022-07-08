import React, { Fragment } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; //note: v6 has breaking changes
import Home from './pages/Home';

const App = () => {
  return(
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={ <Home/> } />
        </Routes>   
      </BrowserRouter>
    </Fragment>
  );
}

export default App;