import { Emitter } from './eventEmitter';
import {IFrame, Frame, AbstractFramesBuilder} from './frame';
import {IPoint, Point} from './point';
import {Timeline} from './timeline';

export abstract class AbstractPlayer {

	state: boolean = false;
	commands: Emitter;
	chartElement: any;
	timeline: Timeline;
	props: any;

	constructor(chartElement: any, timeline: Timeline, props: any) {
		this.chartElement = chartElement;
		this.commands = new Emitter();
		this.timeline = timeline;
		this.props = props;
	}

	protected abstract initPlayer(): void;

	protected initCommands():void {
		var _this = this;

		this.commands.on('pause', function() {
			_this.pause();
		});

		this.commands.on('play', function() {
			_this.play();
		});

		this.commands.on('playorpause', function() {
			(_this.state) ? _this.pause() : _this.play();
		});

		this.commands.on('next', function() {
			_this.next();
		});

		this.commands.on('prev', function() {
			_this.prev();
		});

		this.commands.on('reset', function() {
			_this.reset();
		});
	}

	protected abstract play(): void;

	protected abstract prev(): void;

	protected abstract next(): void;

	protected abstract pause(): void;

	protected abstract reset(): void;

	protected abstract display(): void;

	setTimeline(timeline: Timeline) {
		this.timeline = timeline;
	}

	async sleep(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
	}

}
