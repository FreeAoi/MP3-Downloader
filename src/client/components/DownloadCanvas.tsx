import React, { useRef, useEffect, useContext } from 'react';

import { VideosContext } from '../contexts/videos';
import styles from '../styles/videoList.css';

interface Props {
    id: string;
}

export default function DownloadCanvas({ id }: Props) {
    const { videos } = useContext(VideosContext);
    const progress = videos[id].progress ?? 0;
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.strokeStyle = '#2d2d2d';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, (ctx.canvas.width / 2) - 4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.strokeStyle = '#ccc';
            ctx.beginPath();
            ctx.arc(canvasRef.current.width / 2, canvasRef.current.height / 2, (canvasRef.current.width / 2) - 4, 0, (Math.PI * 2) * progress);
            ctx.stroke();
            ctx.closePath();
        }
    }, [progress]);

    return (<canvas width="34" height="34" ref={canvasRef} className={styles.downloading} />);
}