import { IPoint } from './point';

interface IFrame {
	points: IPoint[];
	duration: number;
}

function Frame(points: IPoint[], duration?: number): IFrame {
	let _duration = (duration) ? duration : 0;
	return { points, 'duration': _duration } as IFrame
}

abstract class AbstractFramesBuilder {
	constructor(protected raw?: any) {
		this.raw = raw;
	}

	abstract build(): IFrame[];
}

export { IFrame, Frame, AbstractFramesBuilder };