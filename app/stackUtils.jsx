import React from 'react';
import * as CONSTS from './constants';

export const getStackLabel = (stackName) => {
    switch (stackName.toLowerCase().trim()) {
        case '':
            return "None";
        case CONSTS.ADD_NEW_STACK_SENTINEL_VALUE:
            return "Add New Stack";
        case CONSTS.SEND_TO_TRASH_STACK_SENTINEL_VALUE:
            return "Trash";
        default:
            return stackName;
    }
}

export const buildStackOptions = (stackList, addNewStackOption) => {
    if (addNewStackOption) {
        stackList.push(CONSTS.ADD_NEW_STACK_SENTINEL_VALUE);
    }
    return stackList.map((s) => <option key={s} value={s}>{getStackLabel(s)}</option>)
}