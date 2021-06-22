import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import VideosProvider from './context';
import App from './app';

ReactDOM.render(<VideosProvider>
    <HashRouter>
        <App />
    </HashRouter>
</VideosProvider>, document.querySelector("#root"));
