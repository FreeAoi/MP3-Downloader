import {useRef, useEffect, useCallback } from 'react'; 
import styles from '../styles/videoList.css'

interface myProps {
    progress: number;
}

export default function downloadProgress(props: myProps) {
    console.log(props.progress);
    const canvasRef = useRef(null);
    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = '#2d2d2d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, (ctx.canvas.width / 2) - 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();
        ctx.arc(canvasRef.current.width / 2, canvasRef.current.height / 2, (canvasRef.current.width / 2) - 4, 0, (Math.PI * 2) * props.progress);
        ctx.stroke();
        ctx.closePath();
    })

    return<canvas width="34" height="34" ref={canvasRef} className={styles.downloading} />
}