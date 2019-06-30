import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import Register from './pages/Register';
import Evaluation from './pages/Evaluation';

function Routes() {
    return (
        <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/register" component={Register} />
            <Route path="/evaluation" component={Evaluation} />
        </Switch>
    );
}

export default Routes;