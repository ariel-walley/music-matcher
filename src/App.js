import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './components/home';
import Error from './components/error';

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
