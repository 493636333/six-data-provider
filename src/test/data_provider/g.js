
import { DataProvider } from '../../index';

export default class G extends DataProvider {
    static timeout = 1000;
    static retry = 0;
    prepare() {

    }
    execute() {
        return new Promise((resolve, reject) => {
            
        });
    }
}