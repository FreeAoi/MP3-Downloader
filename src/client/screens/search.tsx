import style from '../styles/search.css';
import mainStyle from '../styles/main.css';
import videoStyle from '../styles/videoList.css';
import Youtube from 'youtube-sr';
import Videos from '../components/videos';
import { useState, useRef } from 'react';

interface videoProps {
    id: string;
    title: string;
    thumbnail: string;
    authorAvatar: string;
    author: string;
}

export default function testFunc() {

    const inputRef = useRef(null);
    const [videos, setVideos] = useState([])

    const functionThatSearchForSomething = async  (search: string) => {
        let results = await Youtube.search(search, {
			type: "video",
			limit: 5,
			safeSearch: true
		})

        let videos = results?.map(video => {
            return { id: video.id, title: video.title, thumbnail: video.thumbnail.url, author: video.channel.name, authorAvatar: video.channel.icon.url }
        })

        setVideos(videos)
    }

    return (
        <div className={[style.search, mainStyle.pageContent].join(" ")}>
            <div className={style.bar}>
                <input type="text" ref={inputRef} className={style.searchBar} onKeyPress={(e: React.KeyboardEvent) => e.key == "Enter" ? functionThatSearchForSomething(inputRef.current.value) : <></>} placeholder="Insert something to search" spellCheck="false" />
                <button className={style.searchSubmit} onClick={() => inputRef.current && functionThatSearchForSomething(inputRef.current.value)}></button>
            </div>
            <div className={videoStyle.videos}>
                {videos.length < 1
                    ? <h4>There's no nothing to show right now.<br />Try searching something.</h4>
                    : videos.map((video: videoProps) => <Videos key={video.id} {...video} />)
                }
            </div>
        </div>
    )
}