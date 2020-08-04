import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import Logo from "../../assets/logo/logo.svg";
import searchIcon from "../../assets/icons/Icon-search.svg";
import { TimeContext } from "../TimeContext";

export default function Header(history) {
	const [searchQuery, setSearchQuery] = useState("");
	// const [listTime, setListTime] = useState();
	const { listTime, setListTime } = useContext(TimeContext);

	// const handleSearch = (e) => {
	// 	e.preventDefault();
	// 	// history.push("/search");

	// };

	const handleChange = (e) => {
		setSearchQuery(e.target.value);
	};
	return (
		<div className='header__container'>
			<div className='header'>
				<Link className='logoLink' to={"/"}>
					<div className='header__logocontainer'>
						<img className='header__logo' src={Logo} alt='logo' />
					</div>
				</Link>
				<div className='header__input'>
					<input
						type='text'
						name='search'
						id='search'
						placeholder='Find Your Games'
						className='header__search'
						onChange={handleChange}
					/>
					<div>
						<Link className='search__link' to={`/search/${searchQuery}`}>
							<button className='search__button' type='submit'>
								<img src={searchIcon} alt='' />
							</button>
						</Link>
					</div>{" "}
				</div>

				<div className='header__nav'>
					<ul className='header__navlist'>
						{/* <li className='header__navlink'>MY LIST</li> */}
						{/* <li className='header__navlink'>ABOUT</li> */}
						<li className='header__navlink'>{listTime} Hours</li>
					</ul>{" "}
				</div>
			</div>
		</div>
	);
}
