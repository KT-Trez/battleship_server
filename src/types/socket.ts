export interface ClientToServerEvents {
	createRoom: (callback: (roomID: number) => void) => void;
	joinRoom: (roomID: number, nick: string) => void;
	leaveRoom: (roomID: number) => void;
	registerShip: (roomID: number, x: number, y: number, horizontally: boolean, length: number) => void;
}

export interface InterServerEvents {}

export interface ServerToClientEvents {
	gameStarted: () => void;
	hit: (shooterID: string, x: number, y: number, enemiesIDs: string[]) => void;
	miss: (shooterID: string, x: number, y: number) => void;
	nextTurn: (playerID: string, startedAt: Date, duration: number) => void;
	win: (playerID: string) => void;
}

export interface SocketData {}