
import { DataProvider } from '../../index';
export default class A extends DataProvider {
    static deps = ['b'];
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