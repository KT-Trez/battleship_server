import express from 'express';
import BoardService from '../services/BoardService.js';


const router = express.Router();
router.use(express.json());


router.get('/map', (req, res) => {
	const playerID = req.query.playerID as string;
	const roomID = req.query.roomID as string;

	if (!roomID || !playerID)
		return res.sendStatus(400);

	const gameMap = BoardService.getCoordinatesOfPlayerShips(parseInt(roomID), playerID);

	res.send(JSON.stringify(gameMap));
});


export {router as gameRouter};