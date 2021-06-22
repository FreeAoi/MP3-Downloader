import React, { useState, useRef } from 'react';
import Youtube, { Video as RawVideo } from 'youtube-sr';

import videoStyle from '../styles/videoList.css';
import mainStyle from '../styles/main.css';
import Video from '../components/Video';
import style from '../styles/search.css';

export default function Search() {
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [videos, setVideos] = useState<RawVideo[]>([]);

    const functionThatSearchForSomething = async (search: string) => {
        let results = await Youtube.search(search, {
            type: "video",
            limit: 5,
            safeSearch: true
        }).catch(() => []);

        setVideos(results);
        setLoading(false);
    };

    const search = () => {
        if (!inputRef.current || inputRef.current.value === '') return;
        setLoading(true);
        functionThatSearchForSomething(inputRef.current.value);
    };

    return (
        <div className={[style.search, mainStyle.pageContent].join(" ")}>
            <div className={style.bar}>
                <input type="text" ref={inputRef} className={style.searchBar}
                    onKeyUp={(e) => e.key === 'Enter' && search()} placeholder="Insert something to search" spellCheck="false" />
                <button disabled={loading} className={style.searchSubmit} onClick={() => search()}></button>
            </div>
            <div className={videoStyle.videos}>
                {videos.length < 1
                    ? <h4>There's no nothing to show right now.<br />Try searching something.</h4>
                    : videos.map((video) => <Video key={video.id} video={video} />)}
            </div>
        </div>
    );
}