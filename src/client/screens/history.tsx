import React, { useContext, createRef } from 'react';
import { GlobalContext } from '../context';

export default function History() {
    const { videos, addVideo } = useContext(GlobalContext);
    const inputRef = createRef<HTMLInputElement>();

    return (
        <div>
            <h1>Videos</h1>

            <ul>{videos.map((l, i) => (<li key={i}>{l.title}</li>))}</ul>
            <input type="text" ref={inputRef} />
            <input type="button" value="Añadir video" onClick={() => inputRef.current && addVideo(inputRef.current.value)} />
        </div>
    )
}

