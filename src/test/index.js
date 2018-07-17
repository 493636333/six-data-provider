import {DataProvider, DataFactory} from '../index';
import expect from 'expect.js';

describe('provider', function() {
    this.timeout(4000);
    var df = new DataFactory({key: 'key'}, {
        rootPath: __dirname + '/data_provider',
        getClass: (name) => {
            return name + '.js';
        }
    });

    it('basic get provider', async function() {
        const a = await df.getData('a');
        expect(a).to.equal(a, 'provider a+provider b');
    });

    it('circular dependency', async function() {
        try {
            const a = await df.getData('c');
        } catch(e) {
            expect(e.message.indexOf('have loop deep')).to.be.greaterThan(-1);
        }
    });

    it('do not have data-provider', async function() {
        try {
            const a = await df.getData('e');
        } catch(e) {
            expect(e.message.indexOf('Cannot find module')).to.be.greaterThan(-1);
        }
    });

    it('retry time', async function() {
        const date = new Date();
        const a = await df.getData('f');
        expect(a).to.equal('provider f');
        expect(new Date() - date).greaterThan(3000);
    });

    it('retry time except NotEntryError', async function() {
        this.timeout(3000);
        const date = new Date();
        try {
            const a = await df.getData('h');
        } catch (e) {
            expect(e.message.indexOf('not retry error')).to.be.greaterThan(-1);
            expect(new Date() - date).lessThan(2500);
        }
    });

    it('timeout', async function() {
        const date = new Date();
        try {
            const a = await df.getData('g');
        } catch (e) {
            expect(e.message.indexOf('time out')).to.be.greaterThan(-1);
        }
    });

    it('test get function', async function() {
        const a = await df.getData('i');
        expect(a).equal('http://www.dev.baidu.com');

        df.clearCache();
        process.env.NODE_ENV = 'production';

        const b = await df.getData('i');
        expect(b).equal('http://www.baidu.com');
    });
});