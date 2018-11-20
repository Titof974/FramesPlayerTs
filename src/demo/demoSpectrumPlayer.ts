import {AbstractFramesBuilder, SpectrumPlayer, SpectrumPlayerConfig, IFrame, Frame, Point, IPoint, Timeline} from '../framesplayer';

class DummyFramesBuilder extends AbstractFramesBuilder {

	build(): IFrame[] {
		let frames: IFrame[] = []
		for (var i = 0; i < 100; ++i) {
			let points: IPoint[] = [];
			let counter = 0;
			let increase = 90/180*Math.PI / 9;
			for (var j = 0; j < 100; ++j) {
				points.push(Point(j, 180 - Math.sin(counter + i * Math.PI/9) * 120));
				counter += increase;
			}
			frames.push(Frame(points, 100, {'color' : 'blue'}));
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