import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";

import "./Home.scss";

export default function Home() {
	const [trending, setTrending] = useState([]);
	const [callInProgress, setCallInProgress] = useState(true);
	// const date = new Date();

	const override = `
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -50px;
	margin-left: -50px;
`;

	// const convertDate = (day) => {
	// 	const date = new Date();
	// 	const dd = day.getDate();
	// 	const mm = day.getMonth();
	// 	const yyyy = day.getFullYear();

	// 	return `${yyyy}-${mm}-${dd}`;
	// };

	// convertDate(date);

	function getTrending() {
		axios.get("http://localhost:5000/api/trending").then((res) => {
			console.log(res.data);
			setTrending(res.data);
			setCallInProgress(false);
			console.log(res.data[0].cover.image_id);
		});
	}

	// getTrending();

	useEffect(() => {
		getTrending();
	}, []);

	return !callInProgress ? (
		<>
			<div className='heading'>
				<h1 className='trending'>TRENDING</h1>
			</div>
			<div className='home'>
				{trending.map(
					({ id, cover, name, platforms, api_detail_url }, index) => {
						return (
							<Link className='game__link' to={`/game/${id}`} key={id}>
								<div className='game'>
									<div className='game__info' key={id}>
										<div className='game__container'>
											<img
												className='game__cover'
												src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`}
												alt='game'
											/>
										</div>
									</div>
								</div>
							</Link>
						);
					}
				)}
			</div>
		</>
	) : (
		<BarLoader color='black' css={override} />
	);
}
