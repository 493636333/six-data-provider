'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../index');

class G extends _index.DataProvider {
    prepare() {}
    execute() {
        return new Promise((resolve, reject) => {});
    }
}
exports.default = G;
G.timeout = 1000;
G.retry = 0;