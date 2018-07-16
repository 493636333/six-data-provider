'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../index');

let i = 0;
class F extends _index.DataProvider {
    prepare() {}
    execute() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (++i > 2) {
                    resolve('provider f');
                } else {
                    reject(new Error('xi'));
                }
            }, 1000);
        });
    }
}
exports.default = F;
F.retry = 2;