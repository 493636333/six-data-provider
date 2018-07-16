'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../index');

class A extends _index.DataProvider {
    prepare(ctx, params) {
        return params['b'];
    }
    execute(ctx, params) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('provider a+' + params);
            }, 1000);
        });
    }
}
exports.default = A;
A.deps = ['b'];