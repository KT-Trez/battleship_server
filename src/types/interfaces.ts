export interface Client {
	id: string;
	nick: string;
}

export interface Coordinates {
	x: number;
	y: number;
}

export interface PlacementData {
	isPlacementAvailable: boolean;
	tilesAlreadyTaken: Coordinates[];
	tilesContactingObstacles: Coordinates[];
	tilesWithCorrectPlacement: Coordinates[];
}