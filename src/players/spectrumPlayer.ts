import {Emitter} from '../eventEmitter';
import {IFrame, Frame, AbstractFramesBuilder} from '../frame';
import {IPoint, Point} from '../point';
import {Timeline} from '../timeline';
import {AbstractPlayer} from '../abstractPlayer';
import * as d3 from 'd3';

type Domain = { minX: number, maxX: number, minY: number, maxY: number };
type ContextMenuItem = {text: Function, f: Function};

export class SpectrumPlayer extends AbstractPlayer {

	elems: any;

	constructor(chartElement: any, timeline: Timeline, props: any) {
		super(chartElement, timeline, props);
		this.initPlayer();
	}

	 initPlayer(): void {
	 	var _this = this;

		this.elems = {};

		// Body of the player
		this.elems.svg = d3.select("body")
		.append('svg')
		.attr('width', this.props.containerWidth)
		.attr('height', this.props.containerHeight);

		this.elems.g = this.elems.svg.append('g')
		.attr('transform', 'translate(' + this.props.margin.left + ', ' + this.props.margin.top + ')')
		.attr('overflow', 'hidden');

		// Set the ranges
		if (this.props.autoscale) {
			this.props.domain = this.autoFindDomain();
		} else {
			this.props.domain = this.findDomainForFrame();
		}

		this.elems.x = d3.scaleLinear().range([0, this.props.width]).domain([this.props.domain.minX,this.props.domain.maxX]);
		this.elems.y = d3.scaleLinear().range([this.props.height, 0]).domain([this.props.domain.minY, this.props.domain.maxY]);


		// Define the axes
		this.elems.xAxis = d3.axisBottom(this.elems.x).ticks(4);
		this.elems.yAxis = d3.axisLeft(this.elems.y);

		// Draw axes
		this.elems.g.append('g')
		.attr('class', 'axis--x')
		.attr('transform', 'translate(0, ' + this.props.height + ')')
		.call(this.elems.xAxis);

		this.elems.g.append('g')
		.attr('class', 'axis--y')
		.call(this.elems.yAxis)
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', 10)
		.attr('dy', '.1em')
		.attr('text-anchor', 'end')
		.attr('fill', 'rgb(54, 54, 54)')
		.attr('font-size', '1.2em');

		// Brush
		this.initBrush();

		// The line
		this.elems.line = d3.line<IPoint>()
		.x(function(d) { return _this.elems.x(d.x); })
		.y(function(d) { return _this.elems.y(d.y); })
		.curve(d3.curveMonotoneX);

		// Clip
		this.elems.g.append('defs')
		.append('clipPath')
		.attr('id', 'clip')
		.append('rect')
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', this.props.width)
		.attr('height', this.props.height);

		this.elems.main = this.elems.g.append('g')
		.attr('class', 'main')
		.attr('clip-path', 'url(#clip)');

		// Draw the path
		this.elems.path = this.elems.main.append('path')
		.attr('stroke', 'red')
		.attr('stroke-width', 2)
		.attr('shape-rendering', 'auto')
		.attr('fill', 'none')
		.attr('class', 'line');

		this.voironoi();

		// Focus
		this.initFocus();

		// init Overlay
		this.initOverlay();

		// CtrlBar
		this.initControlBar();

		// Display
		this.display();

		// Commands
		this.initCommands();
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
		this.manualFindDomain();
		this.display();
	 }

	 prev(): void {
	 	this.timeline.prev();
		this.manualFindDomain();
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
		this.voironoi();
		// Pass data to path
		this.elems.path.attr("d", this.elems.line(this.timeline.current().points));

		// CtrlBar
		this.drawCtrlBar();
	 }


 	initBrush(): void {
		if (this.props.brush) {
			this.elems.brushcall = d3.brush().on("start", () => { d3.select('.context-menu').remove()}).on("end", this.brushended.bind(this));
			// Draw the brush
			this.elems.brush = this.elems.svg.append("g").attr("class", "brush").call(this.elems.brushcall);
		}
	}

	initFocus(): void {
		if (this.props.focus) {
			this.elems.focus = this.elems.g.append('g').style('display', 'none');
			this.elems.focus.append('circle')
			.attr('id', 'focusCircle')
			.attr('r', 4)
			.attr('class', 'circle focusCircle');
			this.elems.focus.append('line')
			.attr('id', 'focusLineX')
			.attr('class', 'focusLine');
			this.elems.focus.append('line')
			.attr('id', 'focusLineY')
			.attr('class', 'focusLine');
			this.elems.focustextbg = this.elems.focus.append('rect')
			.attr('id', 'focusTextBg')
			.attr('class', 'focusTextBg')
			.attr('transform', 'translate(' + 5 + ', ' + 0 + ')');
  			this.elems.focustext = this.elems.focus.append("text")
			.style("fill", " #41FF00")
			.attr('transform', 'translate(' + 7 + ', ' + 15 + ')');
			this.focusText("0,1");

		}
	}

	focusText(text: string): void {
		this.elems.focustext.text(text);
		if(!this.elems.focustext.node()) return;
		var bbox = this.elems.focustext.node().getBBox();
		this.elems.focustextbg
		.attr("width", bbox.width + 6)
    	.attr("height", bbox.height);
	}

	initOverlay(): void {
		var _this = this;
		this.elems.svg.select('.overlay')
		.attr('transform', 'translate(' + this.props.margin.left + ', ' + this.props.margin.top + ')')
		.attr("class", "overlay")
		.attr("width", this.props.width)
		.attr("height", this.props.height )
		.on("mouseover", function() { if (_this.elems.focus) _this.elems.focus.style("display", null); })
		.on("mouseout", function() { if (_this.elems.focus) _this.elems.focus.style("display", "none"); })
		.on("dblclick", function(){
			_this.resetZoom();
		})
		.on('mousemove', function(this: any) {
			if (_this.elems.focus) {
				var m = d3.mouse(this);
				// use the new diagram.find() function to find the Voronoi site
				// closest to the mouse, limited by max distance voronoiRadius

				var site = _this.elems.voronoiDiagram.find(m[0], m[1], _this.elems.voronoiRadius) as any;
				if (!site) return;

				var x = site[0];
				var y = site[1];

				_this.elems.focus.select('#focusCircle')
				.attr('cx', x)
				.attr('cy', y);
				_this.elems.focus.select('#focusLineX')
				.attr('x1', x).attr('y1', _this.elems.y(_this.elems.y.domain()[0]))
				.attr('x2', x).attr('y2', _this.elems.y(_this.elems.y.domain()[1]));
				_this.elems.focus.select('#focusLineY')
				.attr('x1', _this.elems.x(_this.elems.x.domain()[0])).attr('y1', y)
				.attr('x2', _this.elems.x(_this.elems.x.domain()[1])).attr('y2', y);
				_this.focusText(site.data.x + ", " + site.data.y);
			}
		});
    	d3.select('body')
        .on('click', function() {
            d3.select('.context-menu').remove();
        }).on('contextmenu', function(){ 
	        d3.event.preventDefault();
	        var m = d3.mouse(this as any);
	        if (!_this.elems.menu) {
	        	_this.elems.menu = _this.contextMenu();
	        }
	        _this.elems.menu(m[0], m[1]);
    	});
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
			.attr('width',(this.props.width))
			.attr('x', this.props.margin.left)
			.attr('y', this.props.containerHeight - 30);

			var reDrawCtrlBar = function(this: any) {
				var mouse = d3.mouse(this);
			  	var mx = mouse[0] - _this.props.margin.left;
			  	var my = mouse[1];
			  	var cursor = Math.floor((_this.timeline.size()/_this.props.width)*mx);
			  	_this.pause();
			  	_this.timeline.setCursor(cursor);
			  	_this.manualFindDomain();
			  	_this.display();
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

	voironoi(): void {
		var _this = this;
		// voironoi
		this.elems.voronoiDiagram = d3.voronoi<IPoint>()
		.x(function(d) {return _this.elems.x(d.x); })
		.y(function(d) {return _this.elems.y(d.y); })
		.size([this.props.containerWidth, this.props.containerHeight])(this.timeline.current().points);
		this.elems.voronoiRadius = this.props.width;
	}

	autoFindDomain(): Domain {
		// Scan the timeline
		var domain = {
			minX : +Infinity,
			maxX : -Infinity,
			minY : +Infinity,
			maxY : -Infinity
		}

		this.timeline.frames.forEach((f) => {
			domain.minX = Math.min(domain.minX, ...f.points.map((p) => { return p.x}));
			domain.maxX = Math.max(domain.maxX, ...f.points.map((p) => { return p.x}));
			domain.minY = Math.min(domain.minY, ...f.points.map((p) => { return p.y}));
			domain.maxY = Math.max(domain.maxY, ...f.points.map((p) => { return p.y}));
		});

		if (this.props.domain_offset) {
			domain.minX -= this.props.domain_offset.min_x;
			domain.maxX += this.props.domain_offset.max_x;
			domain.minY -= this.props.domain_offset.min_y;
			domain.maxY += this.props.domain_offset.max_y;
		}
		return domain;
	}

	manualFindDomain() {
		if (this.props.autoscale) { return; }
		this.props.domain = this.findDomainForFrame();
		this.updateDomainAndScale();
	}

	findDomainForFrame() {
		var domain = {
			minX : +Infinity,
			maxX : -Infinity,
			minY : +Infinity,
			maxY : -Infinity
		}

		if (this.props.fixedXscale && !this.props.fixed_minY) {
			this.timeline.frames.forEach((f) => {
				domain.minY = Math.min(domain.minY, ...f.points.map((p) => { return p.y}));
				domain.maxY = Math.max(domain.maxY, ...f.points.map((p) => { return p.y}));
			});
			this.props.fixed_minY = domain.minY;
			this.props.fixed_maxY = domain.maxY;
		}

		let f = this.timeline.current();

		domain.minX = Math.min(domain.minX, ...f.points.map((p) => { return p.x}));
		domain.maxX = Math.max(domain.maxX, ...f.points.map((p) => { return p.x}));

		if (this.props.fixedXscale) {
			domain.minY = this.props.fixed_minY;
			domain.maxY = this.props.fixed_maxY;
		} else {
			domain.minY = Math.min(domain.minY, ...f.points.map((p) => { return p.y}));
			domain.maxY = Math.max(domain.maxY, ...f.points.map((p) => { return p.y}));
		}

		return domain;

	}

	updateDomainAndScale() {
		this.elems.x.domain([this.props.domain.minX,this.props.domain.maxX]);
		this.elems.y.domain([this.props.domain.minY, this.props.domain.maxY]);
		var t = this.elems.svg.transition().duration(0);
		this.elems.g.select(".axis--x").transition(t).call(this.elems.xAxis);
		this.elems.g.select(".axis--y").transition(t).call(this.elems.yAxis);
	}

	setTimeLine(timeline: Timeline) {
		this.timeline = timeline;
		this.display();
	}

	// Brush
	brushended() {
		var s = d3.event.selection;
		if (s) {
			this.elems.x.domain([s[0][0] * this.props.ratio, s[1][0]].map(this.elems.x.invert, this.elems.x));
			this.elems.y.domain([s[1][1], s[0][1] * this.props.ratio].map(this.elems.y.invert, this.elems.y));
			this.elems.svg.select(".brush").call(this.elems.brushcall.move, null);
		}
		this.zoom();
	}

	// Zoom
	zoom() {
		var t = this.elems.svg.transition().duration(0);
		this.elems.g.select(".axis--x").transition(t).call(this.elems.xAxis);
		this.elems.g.select(".axis--y").transition(t).call(this.elems.yAxis);
		this.voironoi();
		this.display();
	}

	resetZoom() {
		this.elems.x.domain([this.props.domain.minX,this.props.domain.maxX]);
		this.elems.y.domain([this.props.domain.minY,this.props.domain.maxY]);
		this.zoom();
	}

	// Context Menu
	contextMenu(): Function{
		var _this = this;
		var height = 0;
		var width = 0;
		var margin = 0.1;
		var items: ContextMenuItem[] = [
		{text : function() {
			if (_this.props.autoscale) {
				return "unlock axes";
			}
			return "lock axes";
		}, f : function() {
			if (_this.props.autoscale) {
				_this.props.autoscale = false;
				_this.props.domain = _this.findDomainForFrame();
				_this.updateDomainAndScale();
				_this.display();
			} else {
				_this.props.autoscale = true;
			_this.props.domain = _this.autoFindDomain();
			_this.updateDomainAndScale();
			_this.display();
			}

		}},
		];
		var rescale = true;

		function menu(x: number, y: number) {
        	d3.select('.context-menu').remove();
        	scaleItems();

	        // Draw the menu
	        d3.select('svg')
	            .append('g').attr('class', 'context-menu')
	            .selectAll('tmp')
	            .data(items).enter()
	            .append('g').attr('class', 'menu-entry')
	            .style('cursor', 'pointer')
	            .on('mouseover', function(){ 
	                d3.select(this).select('rect').attr('class', 'mouseover') })
	            .on('mouseout', function(){ 
	                d3.select(this).select('rect')
	                .attr('class', 'mouseout'); })
	            ;
	        
	        d3.selectAll('.menu-entry')
	            .append('rect')
	            .attr('class', 'mouseout')
	            .attr('x', x)
	            .attr('y', function(d, i){ return y + (i * height); })
	            .attr('width', width)
	            .attr('height', height)
	            .on('click', function(datum ) {
	                (datum as any).f();
	            });
	        
	        d3.selectAll('.menu-entry')
	            .append('text')
	            .text(function(d: ContextMenuItem){ return d.text(); } as any)
	            .attr('x', x)
	            .attr('y', function(d, i){ return y + (i * height); })
	            .attr('dy', height - margin / 2)
	            .attr('dx', margin)
	            .on('click', function(datum ) {
	                (datum as any).f();
	            });
	            
	        function scaleItems() {
		        if (rescale) {
		            d3.select('svg').selectAll('tmp')
		                .data(items).enter()
		                .append('text')
		                .text(function(d){ return d.text(); })
		                .attr('x', -1000)
		                .attr('y', -1000)
		                .attr('class', 'tmp');
		            var z = d3.selectAll('.tmp').nodes()
		                      .map(function(x){ return (x as any).getBBox(); });

		            width = 80;
		            margin = margin * width;
		            width =  width + 2 * margin;
		            height = d3.max(z.map(function(x){ return x.height + margin / 2; })) as any;
		            // cleanup
		            d3.selectAll('.tmp').remove();
		            rescale = false;
		        }
		    }

	    }
	    return menu;
	}
}