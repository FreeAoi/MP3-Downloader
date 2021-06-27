import React, { useContext, useEffect } from 'react';

import { ConfigContext } from '../contexts/config';

export default function History() {
    /* useEffect(() => {
        window["MP3DownloaderAPI"].selectDir();
    }); */

    const selectDir = () => {
        window["MP3DownloaderAPI"].selectDirectory('downloadsDirectory');
    };

    const config = useContext(ConfigContext);

    return (
        <div>
            <h1>Settings</h1>
            <p>{config.downloadsDirectory}</p>
            <button onClick={() => selectDir()}>Change Downloads Directory</button>
        </div>
    );
}

