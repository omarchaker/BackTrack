const express = require("express");
const axios = require("axios");
const hltb = require("howlongtobeat");
const cors = require("cors");
const path = require("path");
const apicalypse = require("apicalypse").default;
const app = express();
require("dotenv").config();

//HowLongtoBeat
let hltbService = new hltb.HowLongToBeatService();

//Giantbomb
const api_key = process.env.API_KEY;
const base_url = "https://www.giantbomb.com/api";

//IGDB
const api_key2 = "ce8e4067dd23fc7b54d800b1aa908b6d";
const igdb_url = "https://api-v3.igdb.com";

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//CORS Middleware
app.use(cors());

//Get Newest Games
app.get("/api/new", (req, res) => {
	axios
		.get(
			`${base_url}/games/?api_key=${api_key}&format=json&sort=original_release_date:desc&filter=original_release_date:2020-01-01|2020-7-19&limit=20`
		)
		.catch((err) => console.log(err))
		.then((response) => {
			res.send(response.data);
		})
		.catch((err) => {});
});

// const GAME_ID = req.params.gameID;

const requestOptions = {
	method: "post", // The default is `get`

	headers: {
		Accept: "application/json",
		"user-key": api_key2,
	},
	responseType: "json",
};

const now = new Date();

//Get Newest Games from IGDB
app.get("/api/trending", async (req, res) => {
	try {
		const response = await apicalypse(requestOptions)
			.fields(
				"age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,cover.*,created_at,dlcs,expansions,external_games,first_release_date,follows,franchise,franchises,game_engines,game_modes,genres,hypes,involved_companies,keywords,multiplayer_modes,name,parent_game,platforms,player_perspectives,popularity,pulse_count,rating,rating_count,release_dates,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,time_to_beat.*,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites"
			)

			.sort("first_release_date", "desc")
			// .sort("aggregated_rating", "desc")
			.sort("popularity", "desc")
			.sort("aggregated_rating", "desc")
			.sort("hypes", "desc")
			.sort("follows", "desc")
			.sort("aggregated_rating_count", "desc")

			.where(
				`first_release_date != null & first_release_date < 1609372800 & first_release_date > 1588291200  & cover != null & cover.width > 100 & popularity != null & aggregated_rating != null & hypes != null`
			)
			.limit(100)

			.request(`${igdb_url}/games`);

		res.send(response.data);
	} catch (err) {
		console.error(err);
	}
});

//Get Single Game from IGDB
app.get("/api/game/:id", async (req, res) => {
	const GAME_ID = req.params.id;
	// res.send(`u just clicked ${GAME_ID}`);

	try {
		const response2 = await apicalypse(requestOptions)
			.fields(
				"age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,cover.*,created_at,dlcs,expansions,external_games,first_release_date,follows,franchise,franchises,game_engines,game_modes,genres.*,hypes,involved_companies,keywords,multiplayer_modes,name,parent_game,platforms.*,player_perspectives,popularity,pulse_count,rating,rating_count,release_dates,screenshots.*,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,time_to_beat.*,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos.*,websites"
			)

			.where(`id = ${GAME_ID}`)

			.request(`${igdb_url}/games`);

		const response3 = await hltbService.search(response2.data[0].name);

		res.json({ data: response2.data, playtime: response3 });
	} catch (err) {
		console.error(err);
	}
});

//Search For Single Game from IGDB
app.get("/api/search/:name", async (req, res) => {
	const SEARCH_NAME = req.params.name;
	// res.send(`u just clicked ${SEARCH_NAME}`);

	try {
		const response4 = await apicalypse(requestOptions)
			.fields(
				"age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,cover.*,created_at,dlcs,expansions,external_games,first_release_date,follows,franchise,franchises,game_engines,game_modes,genres,hypes,involved_companies,keywords,multiplayer_modes,name,parent_game,platforms.*,player_perspectives,popularity,pulse_count,rating,rating_count,release_dates,screenshots.*,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,time_to_beat.*,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos.*,websites"
			)

			.search(SEARCH_NAME)

			.where(
				`first_release_date != null & first_release_date < ${Date.now()}  & cover != null & cover.width > 100 & total_rating != null `
			)
			.limit(100)

			.request(`${igdb_url}/games`);

		res.json(response4.data);
	} catch (err) {
		console.error(err);
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
