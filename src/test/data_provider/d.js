
import { DataProvider } from '../../index';
export default class D extends DataProvider {
    static deps = ['c'];
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