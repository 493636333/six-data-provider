'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../index');

class E extends _index.DataProvider {
    prepare(ctx, params) {}
    execute(ctx, params) {
        return 'provider e';
    }
}
exports.default = E;
E.deps = ['l'];