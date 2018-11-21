"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventEmitter_1 = require("./eventEmitter");
class AbstractPlayer {
    constructor(chartElement, timeline, props) {
        this.state = false;
        this.chartElement = chartElement;
        this.commands = new eventEmitter_1.Emitter();
        this.timeline = timeline;
        this.props = props;
    }
    initCommands() {
        var _this = this;
        this.commands.on('pause', function () {
            _this.pause();
        });
        this.commands.on('play', function () {
            _this.play();
        });
        this.commands.on('playorpause', function () {
            (_this.state) ? _this.pause() : _this.play();
        });
        this.commands.on('next', function () {
            _this.next();
        });
        this.commands.on('prev', function () {
            _this.prev();
        });
        this.commands.on('reset', function () {
            _this.reset();
        });
    }
    setTimeline(timeline) {
        this.timeline = timeline;
    }
    sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
}
exports.AbstractPlayer = AbstractPlayer;
