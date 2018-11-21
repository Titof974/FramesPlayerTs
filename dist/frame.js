"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timeline_1 = require("./timeline");
function Frame(points, duration, options) {
    let _duration = (duration) ? duration : 0;
    return { points, 'duration': _duration, options };
}
exports.Frame = Frame;
class AbstractFramesBuilder {
    constructor(raw) {
        this.raw = raw;
        this.raw = raw;
    }
    toTimeline() {
        return new timeline_1.Timeline(this.build());
    }
}
exports.AbstractFramesBuilder = AbstractFramesBuilder;
