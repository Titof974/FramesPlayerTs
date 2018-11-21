"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
class DummyFramesBuilder extends index_1.AbstractFramesBuilder {
    build() {
        let frames = [];
        for (var i = 0; i < 100; ++i) {
            let points = [];
            for (var j = 0; j < 100; ++j) {
                points.push(index_1.Point(this.getRandomInt(0, 1), this.getRandomInt(0, 1)));
            }
            frames.push(index_1.Frame(points, 100));
        }
        return frames;
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.random() * (max - min) + min;
    }
}
let frames = new DummyFramesBuilder().build();
let player = new index_1.PointsPlayer("body", new index_1.Timeline(frames), index_1.SpectrumPlayerConfig);
exports.player = player;
