'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../index');

class D extends _index.DataProvider {
    prepare(ctx, params) {
        return params['c'];
    }
    execute(ctx, params) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('provider d');
            }, 1000);
        });
    }
}
exports.default = D;
D.deps = ['c'];