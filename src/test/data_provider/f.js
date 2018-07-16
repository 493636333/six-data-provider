
import { DataProvider } from '../../index';
let i = 0;
export default class F extends DataProvider {
    static retry = 2;
    prepare() {

    }
    execute() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (++i > 2) {
                    resolve('provider f');
                } else {
                    reject(new Error('xi'));
                }
            }, 1000);
        })
    }
}