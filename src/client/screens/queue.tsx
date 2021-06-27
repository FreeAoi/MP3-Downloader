import React, { useContext } from 'react';

import videoStyle from '../styles/videoList.css';
import { VideosContext } from '../context';
import style from '../styles/queue.css';
import Video from '../components/Video';
import { Link } from 'react-router-dom';

export default function Queue() {
    const { videos } = useContext(VideosContext);
    const downloadingVideos = Object.values(videos).filter((v) => v.progress < 1);

    return (
        <div className={style.queue}>
            <h1>Queue <span style={{
                fontSize: '0.5em',
                fontWeight: 'normal',
                marginRight: '15px',
                color: '#e2e2e2'
            }}>These are the videos that you are downloading right now</span></h1>
            <div className={videoStyle.videos}>
                {downloadingVideos.length < 1
                    ? <h4>
                        <p>The queue is empty.</p>
                        <br />
                        <p>Go to the <Link to='/'>Search Page</Link>
                        </p>
                    </h4>
                    : downloadingVideos.map((v) => <Video key={v.id} video={v} />)}
            </div>
        </div>
    );
}