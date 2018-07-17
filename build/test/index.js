'use strict';

var _index = require('../index');

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('provider', function () {
    this.timeout(4000);
    var df = new _index.DataFactory({ key: 'key' }, {
        rootPath: __dirname + '/data_provider',
        getClass: name => {
            return name + '.js';
        }
    });

    it('basic get provider', async function () {
        const a = await df.getData('a');
        (0, _expect2.default)(a).to.equal(a, 'provider a+provider b');
    });

    it('circular dependency', async function () {
        try {
            const a = await df.getData('c');
        } catch (e) {
            (0, _expect2.default)(e.message.indexOf('have loop deep')).to.be.greaterThan(-1);
        }
    });

    it('do not have data-provider', async function () {
        try {
            const a = await df.getData('e');
        } catch (e) {
            (0, _expect2.default)(e.message.indexOf('Cannot find module')).to.be.greaterThan(-1);
        }
    });

    it('retry time', async function () {
        const date = new Date();
        const a = await df.getData('f');
        (0, _expect2.default)(a).to.equal('provider f');
        (0, _expect2.default)(new Date() - date).greaterThan(3000);
    });

    it('retry time except NotEntryError', async function () {
        this.timeout(3000);
        const date = new Date();
        try {
            const a = await df.getData('h');
        } catch (e) {
            (0, _expect2.default)(e.message.indexOf('not retry error')).to.be.greaterThan(-1);
            (0, _expect2.default)(new Date() - date).lessThan(2500);
        }
    });

    it('timeout', async function () {
        const date = new Date();
        try {
            const a = await df.getData('g');
        } catch (e) {
            (0, _expect2.default)(e.message.indexOf('time out')).to.be.greaterThan(-1);
        }
    });

    it('test get function', async function () {
        const a = await df.getData('i');
        (0, _expect2.default)(a).equal('http://www.dev.baidu.com');

        df.clearCache();
        process.env.NODE_ENV = 'production';

        const b = await df.getData('i');
        (0, _expect2.default)(b).equal('http://www.baidu.com');
    });
});