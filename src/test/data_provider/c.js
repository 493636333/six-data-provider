
import { DataProvider } from '../../index';
export default class C extends DataProvider {
    static deps = ['d'];
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