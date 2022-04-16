import express from 'express';
import Room from '../classes/Room.js';


const router = express.Router();
router.use(express.json());


router.get('/map', (req, res) => {
	const gameID = req.query.gameID as string;
	const forceID = req.query.gameID as string;

	if (!gameID || !forceID)
		return res.sendStatus(404);

	const game = Room.map.get(parseInt(gameID));
	const gameMap = game.board.getForceMap(forceID);

	res.send(JSON.stringify(gameMap));
});


export {router as gameRouter};