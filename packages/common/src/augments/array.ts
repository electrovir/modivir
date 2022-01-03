/** Same as array.prototype.filter but works with async filter callbacks. */
export async function asyncFilter<ArrayContents>(
    arrayToFilter: ArrayContents[],
    callback: (
        arrayEntry: ArrayContents,
        index: number,
        array: ArrayContents[],
    ) => boolean | Promise<boolean>,
): Promise<ArrayContents[]> {
    const mappedOutput = await Promise.all(arrayToFilter.map(callback));
    return arrayToFilter.filter((entry, index) => {
        const mappedEntry = mappedOutput[index];
        return !!mappedEntry;
    });
}

/** Maps the given array with the given callback and then filters out null and undefined mapped values. */
export function filterMap<ArrayContents, MappedValue>(
    arrayToFilterMap: ArrayContents[],
    callback: (
        arrayEntry: ArrayContents,
        index: number,
        array: ArrayContents[],
    ) => MappedValue | undefined | null,
): NonNullable<MappedValue>[] {
    return arrayToFilterMap.reduce(
        (accum: NonNullable<MappedValue>[], currentValue, index, array) => {
            const mappedValue: MappedValue | null | undefined = callback(
                currentValue,
                index,
                array,
            );
            if (mappedValue != undefined) {
                accum.push(mappedValue as NonNullable<MappedValue>);
            }
            return accum;
        },
        [],
    );
}
