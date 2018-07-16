
import { DataProvider } from '../../index';
export default class B extends DataProvider {
    prepare() {

    }
    execute() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('provider b');
            }, 1000);
        })
    }
}