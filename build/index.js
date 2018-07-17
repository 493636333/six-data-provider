'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DataFactory = exports.DataProvider = exports.NotRetryError = undefined;
exports.getShortEnv = getShortEnv;
exports.getProp = getProp;

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _async = require('async');

var async = _interopRequireWildcard(_async);

var _lodash = require('lodash');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const { slice } = Array.prototype;

const STATUS_INIT = 1;
const STATUS_WAITING = 2;
const STATUS_EXCUTING = 3;
const STATUS_COMPLETE = 4;

const notEntryErrorSymbol = Symbol('NotRetryError');

const ENV_MAP = {
    'production': 'prod',
    'develop': 'dev',
    'development': 'dev'
};

let UNDEFINED;

function getShortEnv(env) {
    return ENV_MAP[env] || env;
};

function getProp(obj, str) {
    return str.split('.').reduce((prev, current) => {
        if (!prev || !(prev instanceof Object)) {
            return UNDEFINED;
        }
        return prev[current];
    }, obj);
}

class NotRetryError extends Error {

    constructor(error) {
        if (error instanceof Error) {
            super(error.message);
            this.type = notEntryErrorSymbol;
            this.stack = error.stack;
        } else if ((0, _lodash.isString)(error)) {
            super(error);
            this.type = notEntryErrorSymbol;
        } else {
            super('not retry error');
            this.type = notEntryErrorSymbol;
        }
    }
}

exports.NotRetryError = NotRetryError;
class DataProvider {
    constructor() {
        this.env = process.env.NODE_ENV;
        this.config = {};
        this._listeners = [];
        this.status = STATUS_INIT;
        this.response = null;
    } // 依赖
    // 每次重试的最长等待时间
    // 重试之间需要间隔多长时间
    // 重试次数
    // 当前的env
    // 当前的config

    // 当前状态


    // excute的结果


    // 根据ctx和依赖构造参数
    prepare(ctx, depsRes) {}

    // 从api获取数据
    execute(ctx, args) {}

    get(str) {
        const env = getShortEnv(this.env);
        if (!this.config) {
            return UNDEFINED;
        }

        const defaultConfig = this.config.default;
        const envConfig = this.config[env];

        if (!str) {
            return (0, _lodash.assign)({}, defaultConfig, envConfig);
        }

        let value = getProp(envConfig, str);
        if (value === UNDEFINED) {
            value = getProp(defaultConfig, str);
        }

        return value;
    }
}

exports.DataProvider = DataProvider;
DataProvider.deps = [];
DataProvider.timeout = 3000;
DataProvider.interval = 0;
DataProvider.retry = 3;
let classCache = {};

const defaultConf = {
    getClass: name => {
        return `./data_provider/${name}.js`;
    },
    rootPath: ''
};
class DataFactory {
    constructor(ctx, conf) {
        this.context = null;
        this.conf = {};
        this.dataCache = {};
        this.providerCache = {};

        if (!ctx || !conf || !conf.rootPath) {
            throw new Error('params error');
        }

        this.context = ctx;
        this.conf = (0, _lodash.assign)({}, defaultConf, conf);
    }

    getData(dataProviderName) {
        const ctx = this.context;
        const dataProvider = this.getProvider(dataProviderName);
        const dataProviderClass = this.getProviderClass(dataProviderName);
        const self = this;
        return new Promise((resolve, reject) => {
            // 如果已经完成，则直接返回
            if (dataProvider.status === STATUS_COMPLETE) {
                if (dataProvider.response instanceof Error) {
                    return reject(dataProvider.response);
                }
                return resolve(dataProvider.response);
            } else if (dataProvider.status === STATUS_INIT) {
                dataProvider.status = STATUS_WAITING;
                const promises = [];

                dataProviderClass.deps.forEach(value => {
                    promises.push(this.getData(value));
                });

                Promise.all(promises).then(async function fn() {
                    dataProvider.status = STATUS_EXCUTING;
                    const argsMap = {};
                    if (dataProviderClass.deps.length) {
                        slice.call(arguments).forEach((item, index) => {
                            const key = dataProviderClass.deps[index];
                            [argsMap[key]] = item;
                        });
                    }

                    const params = dataProvider.prepare(ctx, argsMap);

                    try {
                        dataProvider.response = await self.excuteProvider(dataProvider, params);
                    } catch (e) {
                        dataProvider.response = e;
                    }
                    dataProvider.status = STATUS_COMPLETE;

                    if (dataProvider.response instanceof Error) {
                        reject(dataProvider.response);
                    } else {
                        resolve(dataProvider.response);
                    }
                    dataProvider._listeners.forEach(func => {
                        func(dataProvider.response);
                    });
                }).catch(e => {
                    reject(e);
                });
            } else if (dataProvider.status === STATUS_WAITING || dataProvider.status === STATUS_EXCUTING) {
                dataProvider._listeners.push(res => {
                    if (res instanceof Error) {
                        reject(res);
                    } else {
                        resolve(res);
                    }
                });
            }
        });
    }

    getProviderClass(dataProviderName, checkLoop = true) {
        const {
            getClass,
            rootPath
        } = this.conf;

        if (classCache[dataProviderName]) {
            return classCache[dataProviderName];
        }

        const relativePath = getClass(dataProviderName);;

        let dataProviderPath = path.resolve(rootPath, relativePath);
        dataProviderPath = require.resolve(dataProviderPath);

        let MyDataProvider = require(dataProviderPath);
        MyDataProvider = MyDataProvider.default || MyDataProvider;

        if (!(0, _lodash.isFunction)(MyDataProvider)) {
            throw new Error(`data-provider:${dataProviderName} export is not a class`);
        }

        MyDataProvider.__NAME = dataProviderName;

        if (checkLoop) {
            if (this.checkLoopDep(MyDataProvider)) {
                throw new Error(`Data Provider:${dataProviderName} have loop deep`);
            } else {
                classCache[dataProviderName] = MyDataProvider;
            }
        }

        return MyDataProvider;
    }

    getProvider(dataProviderName) {
        let dataProvider = this.providerCache[dataProviderName];
        if (dataProvider) {
            return dataProvider;
        }
        const MyDataProvider = this.getProviderClass(dataProviderName);
        dataProvider = new MyDataProvider();
        if (!(dataProvider instanceof DataProvider)) {
            throw new Error(`DataProvider:${dataProviderName} not extends module six-data-Provider export DataProvider`);
        }
        this.providerCache[dataProviderName] = dataProvider;
        return dataProvider;
    }

    excuteProvider(dataProvider, params) {
        const MyDataProvider = dataProvider.constructor;
        let {
            retry,
            timeout,
            interval
        } = MyDataProvider;
        const ctx = this.context;
        // 加上本身的一次
        retry++;

        const task = callback => {
            let timmer = setTimeout(() => {
                timmer = null;
                callback(new Error(`Data Provider:${MyDataProvider.__NAME} time out`));
            }, timeout);

            function _callback(error, data) {
                if (timmer) {
                    clearTimeout(timmer);
                    callback(error, data);
                }
            }

            Promise.resolve(dataProvider.execute(ctx, params)).then(res => {
                _callback(null, res);
            }).catch(e => {
                _callback(e);
            });
        };
        return new Promise((resolve, reject) => {
            async.retry({
                times: retry,
                interval,
                errorFilter: error => {
                    if (!error || error instanceof NotRetryError) {
                        return false;
                    }
                    return true;
                }
            }, task, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    checkLoopDep(MyDataProvider, depsMap, classes) {
        const {
            deps
        } = MyDataProvider;

        // 确保只检查一次
        if (typeof MyDataProvider.__IS_LOOP !== 'undefined') {
            return MyDataProvider.__IS_LOOP;
        }

        let isLoop = false;

        depsMap = depsMap || {};
        classes = classes || [];
        depsMap[MyDataProvider.__NAME] = true;
        classes.push(MyDataProvider);

        deps.some(item => {
            const providerClass = this.getProviderClass(item, false);
            depsMap = (0, _lodash.cloneDeep)(depsMap);
            classes = (0, _lodash.cloneDeep)(classes);

            if (depsMap[item]) {
                classes.forEach(cla => {
                    cla.__IS_LOOP = true;
                });
                providerClass.__IS_LOOP = true;
                isLoop = true;
                return true;
            }
            if (this.checkLoopDep(providerClass, depsMap, classes)) {
                isLoop = true;
                return true;
            }
            return false;
        });

        return isLoop;
    }

    clearCache() {
        this.dataCache = {};
        this.providerCache = {};
        classCache = {};
    }
}
exports.DataFactory = DataFactory;