import {Emitter} from '../eventEmitter';
import {IFrame, Frame, AbstractFramesBuilder} from '../frame';
import {IPoint, Point} from '../point';
import {Timeline} from '../timeline';
import {AbstractPlayer} from '../abstractPlayer';
import * as d3 from 'd3';

export class PointsPlayer extends AbstractPlayer {
	elems: any;

	constructor(chartElement: any, timeline: Timeline, props: any) {
		super(chartElement, timeline, props);
		this.initPlayer();
	}

	 initPlayer(): void {
	 	this.elems = {};

	 	// Body of the player
		this.elems.svg = d3.select(this.chartElement)
		.append('svg')
		.attr('width', this.props.containerWidth)
		.attr('height', this.props.containerHeight);

		this.elems.g = this.elems.svg.append('g')
		.attr('transform', 'translate(' + this.props.margin.left + ', ' + this.props.margin.top + ')')
		.attr('overflow', 'hidden');


		this.elems.x = d3.scaleLinear().range([0, this.props.width]).domain([0,1]);
		this.elems.y = d3.scaleLinear().range([this.props.height, 0]).domain([0,1]);


		// Define the axes
		this.elems.xAxis = d3.axisBottom(this.elems.x).ticks(0);
		this.elems.yAxis = d3.axisLeft(this.elems.y).ticks(0);

    	this.display();

    	this.initControlBar();
	 }

	 async play() {
		this.state = true;
		while (this.state && !this.timeline.atEnd()) {
			this.next();
			if (this.state = !this.timeline.atEnd()) {
				await this.sleep(this.timeline.current().duration);
			}
		}
	}

	 next(): void {
	 	this.timeline.next();
		this.display();
	 }

	 prev(): void {
	 	this.timeline.prev();
		this.display();
	 }

	 pause(): void {
	 	this.state = false;
	 }

	 reset(): void{
		this.timeline.setCursor(0);
		this.display();
	 }

	 display(): void {
		let _this = this;

		this.elems.g.selectAll(".dot").remove();

		this.elems.g.selectAll("dot")
		.data(this.timeline.current().points)
		.enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d: any) { return _this.elems.x(d.x); })
        .attr("cy", function(d: any) { return _this.elems.y(d.y); });
	 }

	initControlBar(): void {
		if (this.props.ctrlbar) {
			var _this = this;
			this.elems.ctrlBarBg = this.elems.svg.append('rect')
			.attr('class', 'progress-rect-bg pointer')
			.attr('fill', 'grey')
			.attr('height', 15)
			.attr('width',this.props.width)
			.attr('x', this.props.margin.left)
			.attr('y', this.props.containerHeight - 30);

			this.elems.ctrlBar = this.elems.svg.append('rect')
			.attr('class', 'progress-rect pointer')
			.attr('fill', 'red')
			.attr('height', 15)
			.attr('width',0)
			.attr('x', this.props.margin.left)
			.attr('y', this.props.containerHeight - 30);

			var reDrawCtrlBar = function(this: any) {
				var mouse = d3.mouse(this);
			  	var mx = mouse[0] - _this.props.margin.left;
			  	var my = mouse[1];
			  	var cursor = Math.floor((_this.timeline.size()/_this.props.width)*mx);
			  	_this.pause();
			  	_this.timeline.setCursor(cursor);
			  	_this.display();
			  	_this.drawCtrlBar();
			}

			this.elems.ctrlBarBg.call(d3.drag().on("start", reDrawCtrlBar).on("end",reDrawCtrlBar).on("drag",reDrawCtrlBar));
			this.elems.ctrlBar.call(d3.drag().on("start", reDrawCtrlBar).on("end",reDrawCtrlBar).on("drag",reDrawCtrlBar));
		}
	}

	drawCtrlBar(): void {
		if (this.props.ctrlbar) {
			this.elems.ctrlBar
			.attr('width',(this.props.width/(this.timeline.size()-1))*this.timeline.cursor);
		}
	}
}