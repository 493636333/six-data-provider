
import { DataProvider, NotRetryError } from '../../index';

export default class I extends DataProvider {
    config = {
        default: {
            api: 'http://www.dev.baidu.com',
        },
        prod: {
            api: 'http://www.baidu.com',
        }
    };

    prepare() {

    }
    execute() {
        console.log(this.env);
        return this.get('api');
    }
}