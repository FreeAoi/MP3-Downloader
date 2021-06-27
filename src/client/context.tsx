import React, { createContext } from 'react';
import { Video as RawVideo } from 'youtube-sr';

class Video extends RawVideo {
    progress: number;
}

interface IContext {
    videos: Record<string, Video>;
    addVideo: (video: RawVideo) => void;
}

export const VideosContext = createContext<IContext>({
    videos: {},
    addVideo: () => void 0,
});

export default class VideosP extends React.Component {
    state = {
        videos: {}
    } as Record<'videos', Record<string, Video>>;

    componentDidMount() {
        window['MP3DownloaderAPI'].onProgress(this.updateProgress.bind(this));
    }

    updateProgress(_, { id, progress }) {
        const video = this.state.videos[id];
        if (!video || video.progress === progress) return;
        video.progress = progress;
        this.setState({
            ...this.state,
            videos: {
                ...this.state.videos,
                [id]: video
            }
        });
    };


    addVideo(video: RawVideo) {
        let v = video as Video;
        v.progress = 0;
        this.setState({
            ...this.state,
            videos: {
                ...this.state.videos,
                [video.id]: v
            }
        });
        window['MP3DownloaderAPI'].download(video.id, video.title);
    };

    render() {
        const videos = this.state.videos;
        const addVideo = this.addVideo.bind(this);

        return (
            <VideosContext.Provider value={{ videos, addVideo }}>
                {this.props.children}
            </VideosContext.Provider>
        );
    }
}