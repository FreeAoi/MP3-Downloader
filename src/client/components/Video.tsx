import { Video as RawVideo } from 'youtube-sr';
import React, { useContext } from 'react';

import { VideosContext } from '../contexts/videos';
import styles from '../styles/videoList.css';
import DownloadCanvas from './DownloadCanvas';

interface Props {
    video: RawVideo;
}

export default function Video({ video }: Props) {
    return (
        <div className={styles.video} >
            <img src={video.thumbnail.url} alt={video.title} className={styles.thumbnail} />
            <div className={styles.titles}>
                <p>{video.title}</p>
                <small>
                    <img src={video.channel.iconURL()} alt={video.channel.name} className={styles.avatar} /> {video.channel.name}
                </small>
            </div>
            <div className={styles.buttons}>
                <VideoButtons video={video} />
            </div>
        </div>
    );
};

function VideoButtons({ video }: Props) {
    const { videos, addVideo } = useContext(VideosContext);
    const queueVideo = videos[video.id];

    if (!queueVideo)
        return (<div className={styles.download} onClick={() => addVideo(video)}></div>);
    else if (queueVideo.progress >= 1)
        return <div className={styles.downloaded}></div>;
    else
        return <DownloadCanvas id={video.id} />;
}