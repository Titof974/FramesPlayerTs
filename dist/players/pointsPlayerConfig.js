"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let CONTAINER_WIDTH = 600;
let CONTAINER_HEIGHT = 370;
let MARGIN_TOP = 30;
let MARGIN_LEFT = 30;
let MARGIN_BOTTOM = 60;
let MARGIN_RIGHT = 20;
let WIDTH = CONTAINER_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
let HEIGHT = CONTAINER_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;
exports.PointsPlayerConfig = {
    containerWidth: CONTAINER_WIDTH,
    containerHeight: CONTAINER_HEIGHT,
    margin: { top: MARGIN_TOP, right: MARGIN_RIGHT, bottom: MARGIN_BOTTOM, left: MARGIN_LEFT },
    width: WIDTH,
    height: HEIGHT,
    ratio: HEIGHT / WIDTH,
    domain: { min_x: 0, max_x: 300, min_y: 0, max_y: 300 },
    ctrlbar: true
};
