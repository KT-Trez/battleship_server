import express from 'express';
import BoardService from '../services/BoardService.js';


const router = express.Router();
router.use(express.json());


router.get('/map', (req, res) => {
	const roomID = req.query.roomID as string;
	const forceID = req.query.forceID as string;

	if (!roomID || !forceID)
		return res.sendStatus(404);

	const gameMap = BoardService.getCoordinatesOfPlayerShips(parseInt(roomID), forceID);

	res.send(JSON.stringify(gameMap));
});


export {router as gameRouter};