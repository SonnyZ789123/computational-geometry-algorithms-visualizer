/**
 * Delay the execution of the code.
 *
 * @param {number} t - The amount of ms to wait
 * @returns {Promise<void>} a Promise you have to await
 */
export function delay(t: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
}
