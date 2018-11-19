"use strict";
// Thanks to https://gist.github.com/mudge/5830382
// A proper js event emitter system for web browser
Object.defineProperty(exports, "__esModule", { value: true });
class Emitter {
    constructor() {
        this.events = {};
    }
    _getEventListByName(eventName) {
        if (typeof this.events[eventName] === 'undefined') {
            this.events[eventName] = new Set();
        }
        return this.events[eventName];
    }
    on(eventName, fn) {
        this._getEventListByName(eventName).add(fn);
    }
    once(eventName, fn) {
        const self = this;
        const onceFn = function (...args) {
            self.removeListener(eventName, onceFn);
            fn.apply(self, args);
        };
        this.on(eventName, onceFn);
    }
    emit(eventName, ...args) {
        const that = this;
        this._getEventListByName(eventName).forEach(function (that, fn) {
            fn.apply(that, args);
        }.bind(this));
    }
    removeListener(eventName, fn) {
        this._getEventListByName(eventName).delete(fn);
    }
}
exports.Emitter = Emitter;
