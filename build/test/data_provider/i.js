'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../index');

class I extends _index.DataProvider {
    constructor(...args) {
        var _temp;

        return _temp = super(...args), this.config = {
            default: {
                api: 'http://www.dev.baidu.com'
            },
            prod: {
                api: 'http://www.baidu.com'
            }
        }, _temp;
    }

    prepare() {}
    execute() {
        console.log(this.env);
        return this.get('api');
    }
}
exports.default = I;