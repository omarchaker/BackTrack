import React, { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import "./App.scss";
import Header from "./Components/header/Header";
import Home from "./Components/Home/Home";
import Game from "./Components/Game/Game";
import Search from "./Components/Search/Search";

import { TimeContext } from "./Components/TimeContext";

function App() {
	const [listTime, setListTime] = useState(0);
	return (
		<Router>
			<div className='App'>
				<TimeContext.Provider value={{ listTime, setListTime }}>
					<Header />
					<Switch>
						<Route exact path='/' component={Home} />

						<Route path='/game/:gameID?' component={Game} />

						<Route path='/search/:searchquery?' component={Search} />

						<Home />
					</Switch>
				</TimeContext.Provider>
			</div>
		</Router>
	);
}

export default App;
