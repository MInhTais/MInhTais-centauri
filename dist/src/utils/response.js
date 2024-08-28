"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseError = exports.responseSuccess = void 0;
const responseSuccess = ({ status, data, message }) => {
    return {
        status,
        data,
        message
    };
};
exports.responseSuccess = responseSuccess;
const responseError = ({ data, message }) => {
    return {
        data,
        message
    };
};
exports.responseError = responseError;
