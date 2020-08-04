import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BarLoader from "react-spinners/BarLoader";
import "./game.scss";
import { TimeContext } from "../TimeContext";
export default function Game({ match }) {
	const [game, setGame] = useState([]);
	const [isCutoff, setIsCutoff] = useState(true);
	const [isVisible, setIsVisible] = useState(true);
	const [playtime, setPlaytime] = useState([]);
	const [callInProgress, setCallInProgress] = useState(true);
	const [isAdded, setIsAdded] = useState(false);

	const { listime, setListTime } = useContext(TimeContext);

	const gameSummary = game?.summary;

	const resultString = isCutoff ? game?.summary?.slice(0, 450) : game.summary;
	const buttonText = isCutoff ? "Show More" : "Show Less";
	const listButtonText = isAdded ? "REMOVE FROM LIST" : "ADD TO LIST";

	const override = `
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -50px;
		margin-left: -50px;
	`;

	const isLong = gameSummary?.length > 450;

	function handleListTime() {
		if (!isAdded) {
			setListTime((prevListTime) => prevListTime + playtime);
			setIsAdded(true);
		} else if (isAdded && playtime != 0) {
			setListTime((prevListTime) => prevListTime - playtime);
			setIsAdded(false);
		}
	}

	function toggleCutoff() {
		setIsCutoff(!isCutoff);
	}

	const singleGameID = match.params.gameID;

	function getGame() {
		axios.get(`http://localhost:5000/api/game/${singleGameID}`).then((res) => {
			setGame(res.data.data[0]);
			setCallInProgress(false);

			if (res.data.playtime[0]?.gameplayMain) {
				setPlaytime(res.data.playtime[0]?.gameplayMain);
			} else if (res.data.playtime[0]?.gameplayMain === undefined) {
				setPlaytime(20);
			} else {
				setPlaytime(0);
			}
		});
	}

	// handleUpdateMyList(res.data);

	useEffect(() => {
		getGame();
	}, []);

	// if (isLong) {
	// 	return (
	// 		<button className='read__more italic__header' onClick={toggleCutoff}>
	// 			{buttonText}
	// 		</button>
	// 	);
	// }

	return !callInProgress ? (
		<>
			<div className='gameinfo'>
				<div className='gameinfo__info'>
					{" "}
					<div className='gameinfo__cover'>
						<img
							src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game?.cover?.image_id}.jpg`}
							alt={game.name}
							className='gameinfo__coverimage'
						/>{" "}
						<div className='gameinfo__bottomrow'>
							<div className='gameinfo__numbers'>
								<div className='gameinfo__rating'>
									<h2 className='italic__header'>REVIEW SCORE</h2>
									<h3 className='gameinfo__score italic__header'>{`${Math.floor(
										game.total_rating
									)}`}</h3>
								</div>
								<div className='gameinfo__playtime gameinfo__rating'>
									<h3 className='italic__header'>TIME TO BEAT</h3>
									<h3 className='gameinfo__score italic__header'>{playtime}</h3>
								</div>
							</div>

							<button
								className='gameinfo__add italic__header'
								onClick={() => handleListTime()}
							>
								{listButtonText}
							</button>
						</div>
					</div>
					<div className='gameinfo__text'>
						<div className='text__toprow'></div>
						<h1 className='gameinfo__title'>{game.name}</h1>

						<div className='gameinfo__console'>
							{game?.platforms?.map(({ name }) => {
								return <h3 key={game?.platforms?.id}>{name}</h3>;
							})}
						</div>
						<div className='gameinfo__genre gameinfo__console'>
							{game?.genres?.map(({ name, id }) => {
								return <h3 key={id}>{name}</h3>;
							})}
						</div>

						<div className='gameinfo__summary'>
							<p>
								{resultString}{" "}
								<span className={!isLong ? "button__hide" : "button__text"}>
									<button
										className={`read__more italic__header`}
										onClick={toggleCutoff}
									>
										{buttonText}
									</button>
								</span>
							</p>
						</div>
					</div>
				</div>

				<div className='gameinfo__imagelist'>
					{game?.screenshots?.map(({ image_id, url }) => {
						return (
							<img
								className='gameinfo__images'
								src={`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${image_id}.jpg`}
							/>
						);
					})}
				</div>

				<div className='gameinfo__videos'></div>
			</div>
		</>
	) : (
		<BarLoader color='black' css={override} />
	);
}
