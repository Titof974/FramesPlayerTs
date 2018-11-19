"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Frame(points, duration) {
    let _duration = (duration) ? duration : 0;
    return { points, 'duration': _duration };
}
exports.Frame = Frame;
class AbstractFramesBuilder {
    constructor(raw) {
        this.raw = raw;
        this.raw = raw;
    }
}
exports.AbstractFramesBuilder = AbstractFramesBuilder;
