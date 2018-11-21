import {AbstractFramesBuilder, PointsPlayer, SpectrumPlayerConfig, IFrame, Frame, Point, IPoint, Timeline} from '../../index';

class DummyFramesBuilder extends AbstractFramesBuilder {

	build(): IFrame[] {
		let frames: IFrame[] = []
		for (var i = 0; i < 100; ++i) {
			let points: IPoint[] = [];
			for (var j = 0; j < 100; ++j) {
				points.push(Point(this.getRandomInt(0,1), this.getRandomInt(0,1)));
			}
			frames.push(Frame(points, 100));
		}
		return frames;
	}

	getRandomInt(min: number, max: number): number {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.random() * (max - min) + min;
	}

}
let frames: IFrame[] = new DummyFramesBuilder().build();
let player = new PointsPlayer("body", new Timeline(frames), SpectrumPlayerConfig);

export { player };