import {AbstractFramesBuilder, SpectrumPlayer, SpectrumPlayerConfig, IFrame, Frame, Point, IPoint, Timeline} from '../framesplayer';

class DummyFramesBuilder extends AbstractFramesBuilder {

	build(): IFrame[] {
		let frames: IFrame[] = []
		for (var i = 0; i < 100; ++i) {
			let points: IPoint[] = [];
			for (var j = 0; j < 100; ++j) {
				points.push(Point(j, this.getRandomInt(1,50)));
			}
			frames.push(Frame(points, 100));
		}
		return frames;
	}

	getRandomInt(min: number, max: number): number {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

}
let body = document.getElementsByTagName("body");
let frames: IFrame[] = new DummyFramesBuilder().build();
let player = new SpectrumPlayer(body, new Timeline(frames), SpectrumPlayerConfig);

export { player };