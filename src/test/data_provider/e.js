import { DataProvider } from '../../index';
export default class E extends DataProvider {
    static deps = ['l'];
    prepare(ctx, params) {
        
    }
    execute(ctx, params) {
        return 'provider e';
    }
}