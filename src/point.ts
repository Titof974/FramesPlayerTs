interface IPoint {
	readonly x: number;
	readonly y: number;
}

function Point(x: number, y: number): IPoint {
	return { x, y } as IPoint;
}

export { IPoint, Point };
