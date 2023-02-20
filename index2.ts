import get from 'lodash/get';

type UnionToIntersection<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never;

type Cons<H, T extends readonly any[]> =
  ((h: H, ...t: T) => void) extends ((...r: infer R) => void) ? R : never

type Push<V, T extends readonly any[]> = Cons<any, T> extends infer A ?
  { [K in keyof A]: K extends keyof T ? T[K] : V } : never

type ArrayPathToPath<
    Strings extends Readonly<Array<string | number>>,
> = Strings extends []
    ? ''
    : Strings extends (readonly [string | number] | [string | number])
        ? `${Strings[0]}`
        : Strings extends readonly [
            string | number,
            string | number,
            ...infer Rest extends Array<string | number>,
        ]
            ? `${Strings[1]}` extends `${string | number}`
                ? `${Strings[0]}.${Strings[1]}${ArrayPathToPath<Rest>}`
                : `${Strings[0]}[${Strings[1]}]${ArrayPathToPath<Rest>}`
            : '';
            

type Test = ArrayPathToPath<readonly ['a', 'a']>;

type NestedKeysValuesOf<
    T,
    BasePathT extends [string, string[]]= ['', []],
    Keys = T extends readonly any[] ? Extract<keyof T, `${number}`> : keyof T,
> =
    T extends Array<infer U>
        ? BasePathT[0] extends ''
            ? Record<`[${number}]`, [U, readonly [`[${number}]`]]> & NestedKeysValuesOf<T[number], [`[${number}]`, [`[${number}]`]]>
            : Record<`${BasePathT[0]}[${number}]`, [U, Readonly<Push<`${number}`, BasePathT[1]>>]> & NestedKeysValuesOf<T[number], [`${BasePathT[0]}[${number}]`, Push<`${number}`, BasePathT[1]>]>
        : T extends {[Keys: string | number]: infer V}
            ? Keys extends string | number
                ? BasePathT[0] extends ''
                    ? Record<`${Keys}`, [T[Keys], readonly [`${Keys}`]]> & NestedKeysValuesOf<T[Keys], [`${Keys}`, [`${Keys}`]]>
                    : Record<`${BasePathT[0]}.${Keys}`, [T[Keys], Readonly<Push<`${Keys}`, BasePathT[1]>>]> & NestedKeysValuesOf<T[Keys], [`${BasePathT[0]}.${Keys}`, Push<`${Keys}`, BasePathT[1]>]>
                : unknown
            : 
            T extends readonly any[]
                ? Keys extends keyof T
                    ? Keys extends (string | number)
                        ? BasePathT[0] extends ''
                            ? Record<`[${Keys}]`, [T[Keys], readonly [`[${Keys}]`]]> & NestedKeysValuesOf<T[Keys], [`[${Keys}]`, [`[${Keys}]`, `[${Keys}]`]]>
                            : Record<`${BasePathT[0]}[${Keys}]`, [T[Keys], Readonly<Push<`[${Keys}]`, BasePathT[1]>>]> & NestedKeysValuesOf<T[Keys], [`${BasePathT[0]}[${Keys}]`, Push<`[${Keys}]`, BasePathT[1]>]>
                        : unknown
                    : unknown
                : unknown;

type NestedKeyTypeMap<
    T,
    B extends [string, string[]]= ['', []],
    Keys = T extends readonly any[] ? Extract<keyof T, `${number}`> : keyof T,
> = UnionToIntersection<NestedKeysValuesOf<T, B, Keys>>;

const targetObj = {
    a: 1,
    b: '2',
    c: {
        a: 1,
        b: '2',
        c: [1,2,3],
        d: [1, '2', 3] as const,
    },
};

type A = NestedKeyTypeMap<typeof targetObj>;

export function getIn<
    T,
    KeyValueMap extends NestedKeyTypeMap<T>,
    ArrayPath extends KeyValueMap[keyof KeyValueMap][1],
    Path = ArrayPathToPath<ArrayPath>,
>(object: T, path: ArrayPath): KeyValueMap[Path][0] {
    return get(object, path as any);
}

const a = getIn(targetObj, ['c', 'd', '[1]'] as const);
