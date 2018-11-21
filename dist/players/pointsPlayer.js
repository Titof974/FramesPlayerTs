"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractPlayer_1 = require("../abstractPlayer");
const d3 = __importStar(require("d3"));
class PointsPlayer extends abstractPlayer_1.AbstractPlayer {
    constructor(chartElement, timeline, props) {
        super(chartElement, timeline, props);
        this.initPlayer();
    }
    initPlayer() {
        this.elems = {};
        // Body of the player
        this.elems.svg = d3.select(this.chartElement)
            .append('svg')
            .attr('width', this.props.containerWidth)
            .attr('height', this.props.containerHeight);
        this.elems.g = this.elems.svg.append('g')
            .attr('transform', 'translate(' + this.props.margin.left + ', ' + this.props.margin.top + ')')
            .attr('overflow', 'hidden');
        this.elems.x = d3.scaleLinear().range([this.props.range.min_x, this.props.range.max_x]).domain([this.props.domain.min_x, this.props.domain.max_x]);
        this.elems.y = d3.scaleLinear().range([this.props.range.min_y, this.props.range.max_y]).domain([this.props.domain.min_y, this.props.domain.max_y]);
        // Define the axes
        this.elems.xAxis = d3.axisBottom(this.elems.x).ticks(0);
        this.elems.yAxis = d3.axisLeft(this.elems.y).ticks(0);
        this.initControlBar();
        this.display();
        this.initCommands();
    }
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state = true;
            while (this.state && !this.timeline.atEnd()) {
                this.next();
                if (this.state = !this.timeline.atEnd()) {
                    yield this.sleep(this.timeline.current().duration);
                }
            }
        });
    }
    next() {
        this.timeline.next();
        this.display();
    }
    prev() {
        this.timeline.prev();
        this.display();
    }
    pause() {
        this.state = false;
    }
    reset() {
        this.timeline.setCursor(0);
        this.display();
    }
    display() {
        let _this = this;
        this.elems.g.selectAll(".dot").remove();
        this.elems.g.selectAll("dot")
            .data(this.timeline.current().points)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function (d) { return _this.elems.x(d.x); })
            .attr("cy", function (d) { return _this.elems.y(d.y); });
        // CtrlBar
        this.drawCtrlBar();
    }
    initControlBar() {
        if (this.props.ctrlbar) {
            var _this = this;
            this.elems.ctrlBarBg = this.elems.svg.append('rect')
                .attr('class', 'progress-rect-bg pointer')
                .attr('fill', 'grey')
                .attr('height', 15)
                .attr('width', this.props.width)
                .attr('x', this.props.margin.left)
                .attr('y', this.props.containerHeight - 30);
            this.elems.ctrlBar = this.elems.svg.append('rect')
                .attr('class', 'progress-rect pointer')
                .attr('fill', 'red')
                .attr('height', 15)
                .attr('width', 0)
                .attr('x', this.props.margin.left)
                .attr('y', this.props.containerHeight - 30);
            var reDrawCtrlBar = function () {
                var mouse = d3.mouse(this);
                var mx = mouse[0] - _this.props.margin.left;
                var my = mouse[1];
                var cursor = Math.floor((_this.timeline.size() / _this.props.width) * mx);
                _this.pause();
                _this.timeline.setCursor(cursor);
                _this.display();
                _this.drawCtrlBar();
            };
            this.elems.ctrlBarBg.call(d3.drag().on("start", reDrawCtrlBar).on("end", reDrawCtrlBar).on("drag", reDrawCtrlBar));
            this.elems.ctrlBar.call(d3.drag().on("start", reDrawCtrlBar).on("end", reDrawCtrlBar).on("drag", reDrawCtrlBar));
        }
    }
    drawCtrlBar() {
        if (this.props.ctrlbar) {
            this.elems.ctrlBar
                .attr('width', (this.props.width / (this.timeline.size() - 1)) * this.timeline.cursor);
        }
    }
}
exports.PointsPlayer = PointsPlayer;
