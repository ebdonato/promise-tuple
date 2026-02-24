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
 * @param successCallback - Optional callback to execute when the promise resolves successfully.
 * @param failureCallback - Optional callback to execute when the promise rejects.
 * @returns A promise that resolves to a tuple containing either an error or a result.
 *          On success: `[undefined, result]`
 *          On failure: `[error, undefined]`
 *
 * @example
 * const [error, data] = await promiseTuple(fetchData());
 * if (error) {
 *   console.error('Error:', error);
 * } else {
 *   console.log('Data:', data);
 * }
 *
 * @example
 * const [error, data] = await promiseTuple(
 *   fetchData(),
 *   () => console.log('Success!'),
 *   () => console.log('Failed!')
 * );
 */
export async function promiseTuple<R = unknown, E = unknown>(
  promise: Promise<R>,
  successCallback?: () => void,
  failureCallback?: () => void,
): Promise<[E, undefined] | [undefined, R]> {
  return promise
    .then(
      (result) => (successCallback?.(), [undefined, result] as [undefined, R]),
    )
    .catch(
      (error) => (failureCallback?.(), [error, undefined] as [E, undefined]),
    );
}

export default promiseTuple;
