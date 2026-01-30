/**
 * Handles a promise and returns a tuple with error and result.
 *
 * This function wraps a promise and returns a tuple containing either an error or a result,
 * similar to Go's error handling pattern. If the promise resolves, the tuple will contain
 * `[undefined, result]`. If the promise rejects, the tuple will contain `[error, undefined]`.
 *
 * @template R - The type of the resolved value. Defaults to `unknown`.
 * @template E - The type of the error. Defaults to `unknown`.
 * @param promise - The promise to handle.
 * @returns A promise that resolves to a tuple containing either an error or a result.
 *
 * @example
 * const [error, data] = await promiseTuple(fetchData());
 * if (error) {
 *   console.error('Error:', error);
 * } else {
 *   console.log('Data:', data);
 * }
 */
export async function promiseTuple<R = unknown, E = unknown>(
    promise: Promise<R>
): Promise<[E | undefined, R | undefined]> {
    return promise
        .then((result) => [undefined, result] as [undefined, R])
        .catch((error) => [error, undefined] as [E, undefined])
}
export default promiseTuple
