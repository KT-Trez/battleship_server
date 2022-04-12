export interface ClientToServerEvents {
	createRoom: (callback: (roomID: number) => void) => void;
	joinRoom: (roomID: number, nick: string) => void;
	leaveRoom: (roomID: number) => void;
	registerShip: (roomID: number, x: number, y: number, horizontally: boolean, length: number) => void;
}

export interface InterServerEvents {}

export interface ServerToClientEvents {}

export interface SocketData {}