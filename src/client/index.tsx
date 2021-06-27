import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import VideosProvider from './contexts/videos';
import ConfigProvider from './contexts/config';
import App from './app';

ReactDOM.render(<ConfigProvider>
    <VideosProvider>
        <HashRouter>
            <App />
        </HashRouter>
    </VideosProvider>
</ConfigProvider>, document.querySelector("#root"));
