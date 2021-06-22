import { createContext, FC, ReactNode, useState } from 'react';

interface Video {
    title: String
}

interface IContext {
    videos: Video[];
    addVideo: (title: string) => void;
}

export const GlobalContext = createContext<IContext>({
    videos: [],
    addVideo: () => void 0
});

const GlobalProvider: FC<ReactNode> = ({ children }) => {
    const [videos, setVideos] = useState<Video[]>([]);

    const addVideo = (title: string) =>
        setVideos([
            ...videos,
            { title }
        ]);

    return (
        <GlobalContext.Provider value={{ videos, addVideo }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;