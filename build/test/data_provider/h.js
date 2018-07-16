'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../index');

let i = 0;
class H extends _index.DataProvider {
    prepare() {}
    execute() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                ++i;
                if (i > 2) {
                    resolve('provider f');
                } else if (i == 2) {
                    reject(new _index.NotRetryError());
                } else {
                    reject(new Error('xi'));
                }
            }, 1000);
        });
    }
}
exports.default = H;
H.retry = 2;