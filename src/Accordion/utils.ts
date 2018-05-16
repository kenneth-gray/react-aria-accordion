/* istanbul ignore file */
// tslint:disable-next-line ban-types
export const callAll = (...fns: Array<Function | undefined>) => (
  ...args: any[]
) => fns.forEach(fn => fn && fn(...args));

// tslint:disable-next-line no-empty
export const noop = () => {};
