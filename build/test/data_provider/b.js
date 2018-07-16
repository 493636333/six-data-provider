'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../index');

class B extends _index.DataProvider {
    prepare() {}
    execute() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('provider b');
            }, 1000);
        });
    }
}
exports.default = B;