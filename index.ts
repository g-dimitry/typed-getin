type NestedKeysValuesOf<T, B extends string='', Keys = keyof T> =
T extends Array<infer U>
    ? B extends ''
        ? Record<`[${number}]`, U> & NestedKeysValuesOf<T[number], `[${number}]`>
        : Record<`${B}[${number}]`, U> & NestedKeysValuesOf<T[number], `${B}[${number}]`>
    : T extends {[Keys: string | number]: infer V}
        ? Keys extends string | number
            ? B extends ''
                ? Record<`${Keys}`, T[Keys]> & NestedKeysValuesOf<T[Keys], `${Keys}`>
                : Record<`${B}.${Keys}`, T[Keys]> & NestedKeysValuesOf<T[Keys], `${B}.${Keys}`>
            : unknown
        :unknown;

function getIn<
    T,
    KeyValueMap extends NestedKeysValuesOf<T>,
    Path extends keyof KeyValueMap,
>(object: T, path: Path): KeyValueMap[Path] {

}

const targetObj = {c: {b: [1,2,3]}};
const final = getIn(targetObj, 'c.b[1]');
