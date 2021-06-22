import loadable from '@loadable/component';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = loadable(() => import('./app'))

ReactDOM.render(<App/>, document.querySelector("#root"));
