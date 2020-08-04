import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./Search.scss";
import BarLoader from "react-spinners/BarLoader";

export default function Search({ match }) {
	const [searchResults, setSearchResults] = useState([]);
	const [callInProgress, setCallInProgress] = useState(true);

	const override = `
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -50px;
	margin-left: -50px;
`;
	const searchName = match.params.searchquery;

	const getSearchResults = () => {
		axios.get(`http://localhost:5000/api/search/${searchName}`).then((res) => {
			setSearchResults(res.data);
			setCallInProgress(false);
		});
	};

	useEffect(() => {
		getSearchResults();
	}, [searchName]);

	return !callInProgress ? (
		<>
			<div className='heading'>
				<h1 className='trending'>
					RESULTS FOR: <span className='search__entry'>{searchName}</span>
				</h1>
			</div>
			<div className='home'>
				{searchResults.map(
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
