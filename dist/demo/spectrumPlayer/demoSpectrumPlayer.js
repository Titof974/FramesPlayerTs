"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
;
class DummyFramesBuilder extends index_1.AbstractFramesBuilder {
    build() {
        let frames = [];
        for (var i = 0; i < 100; ++i) {
            let points = [];
            let counter = 0;
            let increase = 90 / 180 * Math.PI / 9;
            for (var j = 0; j < 100; ++j) {
                points.push(index_1.Point(j, 180 - Math.sin(counter + i * Math.PI / 9) * 120));
                counter += increase;
            }
            frames.push(index_1.Frame(points, 100, { 'color': 'blue' }));
        }
        return frames;
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
let frames = new DummyFramesBuilder().build();
let player = new index_1.SpectrumPlayer("body", new index_1.Timeline(frames), index_1.SpectrumPlayerConfig);
exports.player = player;
