export interface ClientToServerEvents {
	createRoom: (callback: (roomID: number) => void) => void;
	joinRoom: (roomID: number, nick: string) => void;
	leaveRoom: (roomID: number) => void;
	registerShip: (roomID: number, x: number, y: number, horizontally: boolean, length: number) => void;
	registerShipsRandom: (roomID: number, callback: (forceArr: { x: number, y: number }[]) => void) => void;
	registerShot: (roomID: number, x: number, y: number, callback: (result: boolean) => void) => void;
}

export interface InterServerEvents {
}

export interface ServerToClientEvents {
	gameStarted: (playersIDs: string[]) => void;
	hit: (shooterID: string, x: number, y: number, enemiesIDs: string[]) => void;
	miss: (shooterID: string, x: number, y: number, enemiesIDs: string[]) => void;
	nextTurn: (playerID: string, startedAt: Date, duration: number) => void;
	win: (playerID: string) => void;
}

export interface SocketData {
}