// @flow

'use strict';

// eslint-disable-next-line no-unused-vars
class DivisionByZeroError extends RangeError {
  // flowlint-next-line unclear-type:off
  constructor(...params /* : any[] */) {
    super('Division by zero', ...params);
    if (RangeError.captureStackTrace) {
      RangeError.captureStackTrace(this, DivisionByZeroError);
    }
  }
}

/* ::
export { DivisionByZeroError };
*/
