"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Timeline {
    constructor(frames) {
        this.frames = frames;
        this.cursor = 0;
    }
    setCursor(i) {
        if (i >= 0 && i < this.size()) {
            this.cursor = i;
        }
        else if (i > this.size()) {
            this.cursor = this.size() - 1;
        }
        else {
            this.cursor = 0;
        }
    }
    size() {
        return this.frames.length;
    }
    current() {
        return this.frames[this.cursor];
    }
    next() {
        if (this.cursor < this.size() - 1)
            this.cursor++;
        return this.current();
    }
    prev() {
        if (this.cursor > 0)
            this.cursor--;
        return this.current();
    }
    atEnd() {
        return this.cursor == this.size() - 1;
    }
}
exports.Timeline = Timeline;
