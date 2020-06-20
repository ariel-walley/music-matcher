import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './home';
import Error from './error';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Switch> {/* Switch keeps the error message from showing up on each page */}
        <Route path='/' component={ Home } exact/>
        <Route component={Error}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
