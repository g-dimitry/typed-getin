import get from 'lodash/get';

type UnionToIntersection<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never;

type NestedKeysValuesOf<
    T,
    BasePathT extends string='',
    Keys = T extends readonly any[] ? Extract<keyof T, `${number}`> : keyof T,
> =
    T extends Array<infer U>
        ? BasePathT extends ''
            ? Record<`[${number}]`, U> & NestedKeysValuesOf<T[number], `[${number}]`>
            : Record<`${BasePathT}[${number}]`, U> & NestedKeysValuesOf<T[number], `${BasePathT}[${number}]`>
        : T extends {[Keys: string | number]: infer V}
            ? Keys extends string | number
                ? BasePathT extends ''
                    ? Record<`${Keys}`, T[Keys]> & NestedKeysValuesOf<T[Keys], `${Keys}`>
                    : Record<`${BasePathT}.${Keys}`, T[Keys]> & NestedKeysValuesOf<T[Keys], `${BasePathT}.${Keys}`>
                : unknown
            : T extends readonly any[]
                ? Keys extends (string | number) & keyof T
                    ? BasePathT extends ''
                        ? Record<`[${Keys}]`, T[Keys]> & NestedKeysValuesOf<T[Keys], `[${Keys}]`>
                        : Record<`${BasePathT}[${Keys}]`, T[Keys]> & NestedKeysValuesOf<T[Keys], `${BasePathT}[${Keys}]`>
                    : unknown
                : unknown;

type NestedKeyTypeMap<T, B extends string='', Keys = keyof T> = UnionToIntersection<NestedKeysValuesOf<T, B, Keys>>;

function getIn<
    T,
    KeyValueMap extends NestedKeyTypeMap<T>,
    Path extends keyof KeyValueMap,
>(object: T, path: Path): KeyValueMap[Path] {
    return get(object, path);
}

const targetObj = {
    a: 1,
    c: {
        a: 1,
        b: ['1',2,3] as const,
        c: [1,2,3],
    },
};
const final = getIn(targetObj, 'c.c[0]');
console.log(final);
