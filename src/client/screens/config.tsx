import React, { useEffect } from 'react';

export default function History() {
	
    // testing purpose
    useEffect(() => {
        window["MP3DownloaderAPI"].selectDir()
    })

    return (
        <div>
            <h1>Settings</h1>
        </div>
    );
}

