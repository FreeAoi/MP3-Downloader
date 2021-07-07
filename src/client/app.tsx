import React, { useContext, useEffect, useState } from 'react';
import { Link, Route, Switch, useLocation } from "react-router-dom";

import Config from "./screens/config";
import Search from "./screens/search";
import Queue from "./screens/queue";

import { VideosContext } from './contexts/videos';
import style from "./styles/main.css";

export default function App() {
	const [maximized, setMaximized] = useState(false);
	const { videos } = useContext(VideosContext);
	const [loaded, setLoaded] = useState(false);
	const location = useLocation();

	const checkUpdates = () => {
		window['MP3DownloaderAPI'].onUpdateConfirm((_, data) => setLoaded(data));
		window['MP3DownloaderAPI'].checkUpdates();
	};

	useEffect(() => checkUpdates(), []);

	useEffect(() => {
		if (!loaded) return () => { };

		const onClick = (type: string) => {
			if (type === 'maximize')
				setMaximized(!document.getElementById(type).classList.contains(style.max));
			window['MP3DownloaderAPI'].sendToWindow(type);
		};

		document.getElementById('minimize').addEventListener('click', () => onClick('minimize'));
		document.getElementById('maximize').addEventListener('click', () => onClick('maximize'));
		document.getElementById('close').addEventListener('click', () => onClick('close'));

		return () => {
			document.getElementById('minimize').removeEventListener('click', () => onClick('minimize'));
			document.getElementById('maximize').removeEventListener('click', () => onClick('maximize'));
			document.getElementById('close').removeEventListener('click', () => onClick('close'));
		};
	}, [loaded]);

	if (!loaded)
		return (<div className={style.loading}>
			<h1>MP3 Downloader</h1>
			<div className={style.bar}><div></div></div>
		</div>);

	return (
		<div>
			<div className={style.titlebar}>
				<div className={style.title}>YouTube MP3 Downloader</div>
				<div className={style.buttons}>
					<div id="minimize" className={style.minimize}></div>
					<div id="maximize" className={`${style.maximize} ${maximized ? style.max : ''}`.trim()}></div>
					<div id="close" className={style.close}></div>
				</div>
			</div>
			<div className={style.main}>
				<div className={style.menu}>
					<Link to="/queue">
						<div className={`${style.queue} ${location.pathname === '/queue' ? style.selected : ''}`}></div>
					</Link>
					<Link to="/">
						<div className={`${style.search} ${location.pathname === '/' ? style.selected : ''}`}></div>
					</Link>
					<Link to="/config">
						<div className={`${style.config} ${location.pathname === '/config' ? style.selected : ''}`}></div>
					</Link>
				</div>
				<div className={style.content}>
					<div className={style.background}></div>
					<div className={style.pageContent}>
						<Switch>
							<Route exact path="/">
								<Search />
							</Route>
							<Route path="/queue">
								<Queue />
							</Route>
							<Route path="/config">
								<Config />
							</Route>
						</Switch>
					</div>
				</div>
			</div>
		</div>
	);
}
