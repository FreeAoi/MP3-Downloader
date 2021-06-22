import { Video as RawVideo } from 'youtube-sr';
import React, { useContext } from 'react';

import { VideosContext } from '../context';
import styles from '../styles/videoList.css';
import DownloadCanvas from './DownloadCanvas';

// class Video extends React.Component<videoProps, videoState> {
//     state = {
//         isDownloading: false,
//         progress: 0
//     };

//     startDownload() {
//         this.setState({ isDownloading: true });
//         /* ipcRenderer.send("start-download", { id: this.props.id, title: this.props.title});
//         ipcRenderer.on("download-progress", (_, arg: number) => {
//             this.setState({ progress: arg });
//         }) */
//     }

//     conditionalShow() {
//         if (!this.state.isDownloading) {
//             return <div className={styles.download} onClick={() => this.startDownload()}></div>;
//         } else if (this.state.progress == 1) {
//             return <div className={styles.downloaded}></div>;
//         } else {
//             return <DownloadCanvas id={''} />;
//         }
//     }

//     render() {
//         return (
//             <div className={styles.video} >
//                 <img src={this.props.thumbnail} alt={this.props.title} className={styles.thumbnail} />
//                 <div className={styles.titles}>
//                     <p>{this.props.title}</p>
//                     <small>
//                         <img src={this.props.authorAvatar} alt={this.props.author} className={styles.avatar} /> {this.props.author}
//                     </small>
//                 </div>
//                 <div className={styles.buttons}>
//                     {this.conditionalShow()}
//                 </div>
//             </div>
//         );
//     }
// }

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
    else if (queueVideo.progress >= 100)
        return <div className={styles.downloaded}></div>;
    else
        return <DownloadCanvas id={video.id} />;
}