'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../index');

class C extends _index.DataProvider {
    prepare(ctx, params) {
        return params['d'];
    }
    execute(ctx, params) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('provider c');
            }, 1000);
        });
    }
}
exports.default = C;
C.deps = ['d'];