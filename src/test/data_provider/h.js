
import { DataProvider, NotRetryError } from '../../index';

let i = 0;
export default class H extends DataProvider {
    static retry = 2;
    prepare() {

    }
    execute() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                ++i;
                if (i > 2) {
                    resolve('provider f');
                } else if (i == 2) {
                    reject(new NotRetryError());
                } else {
                    reject(new Error('xi'));
                }
            }, 1000);
        })
    }
}