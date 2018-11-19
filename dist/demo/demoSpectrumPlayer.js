"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framesplayer_js_1 = require("../framesplayer.js");
class DummyFramesBuilder extends framesplayer_js_1.AbstractFramesBuilder {
    build() {
        let frames = [];
        for (var i = 0; i < 100; ++i) {
            let points = [];
            for (var j = 0; i < 1000; ++i) {
                points.push(framesplayer_js_1.Point(i, this.getRandomInt(1, 50)));
            }
            frames.push(framesplayer_js_1.Frame(points, 100));
        }
        return frames;
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
let body = document.getElementsByTagName("body");
let frames = new DummyFramesBuilder().build();
let player = new framesplayer_js_1.SpectrumPlayer(body, new framesplayer_js_1.Timeline(frames), framesplayer_js_1.SpectrumPlayerConfig);
exports.player = player;
