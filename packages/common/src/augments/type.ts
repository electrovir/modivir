export type TypeofReturnValue =
    | 'bigint'
    | 'boolean'
    | 'function'
    | 'number'
    | 'object'
    | 'string'
    | 'symbol'
    | 'undefined';

export type TypeofReturnToTypeMapping = {
    bigint: bigint;
    boolean: boolean;
    function: Function;
    number: number;
    object: object;
    string: string;
    symbol: symbol;
    undefined: undefined;
};
