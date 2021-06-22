import React from 'react'; 
import styles from '../styles/videoList.css'
import Canvas from './downloadProgress';

const { ipcRenderer } = window.require("electron");

interface videoProps {
    title: string;
    thumbnail: string;
    authorAvatar: string;
    author: string;
    id: string;
}

interface videoState {
    isDownloading: boolean;
    progress: number;
}

class Video extends React.Component<videoProps, videoState> {

    state = {
        isDownloading: false,
        progress: 0
    }

    startDownload() {
        this.setState({ isDownloading: true });
        ipcRenderer.send("start-download", { id: this.props.id, title: this.props.title});
        ipcRenderer.on("download-progress", (_, arg: number) => {
            this.setState({ progress: arg });
        })
    }

    conditionalShow() {
        if(!this.state.isDownloading) {
            return <div className={styles.download} onClick={() => this.startDownload()}></div>
        } else if(this.state.progress == 1) {
            return <div className={styles.downloaded}></div>
        } else {
            return <Canvas progress={this.state.progress} />
        }
    }

    render() {
        return(
            <div className={styles.video} >
                <img src={this.props.thumbnail} alt={this.props.title} className={styles.thumbnail} />
                <div className={styles.titles}>
                    <p>{this.props.title}</p>
                    <small>
                        <img src={this.props.authorAvatar} alt={this.props.author} className={styles.avatar} /> {this.props.author}
                    </small>
                </div>
                <div className={styles.buttons}>
                    {this.conditionalShow()}
                </div>
            </div>
        )
    }

}

export default Video;