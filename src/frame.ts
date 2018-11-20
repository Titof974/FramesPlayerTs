import { IPoint } from './point';
import { Timeline } from './timeline';

interface IFrame {
	points: IPoint[];
	duration: number;
	options?: any;
}

function Frame(points: IPoint[], duration?: number, options?:any): IFrame {
	let _duration = (duration) ? duration : 0;
	return { points, 'duration': _duration, options } as IFrame
}

abstract class AbstractFramesBuilder {
	constructor(protected raw?: any) {
		this.raw = raw;
	}

	abstract build(): IFrame[];
}

export { IFrame, Frame, AbstractFramesBuilder };