// @flow

'use strict';

/* :: import { type Field } from './field'; */

// eslint-disable-next-line no-unused-vars
class Matrix /* :: <T: Field<*>> */ {
  /* ::
  _rows: number;
  _columns: number;
  _elements: T[];
  */

  constructor(
    rows /* : number */,
    columns /* : number */,
    elements /* : T[] | (number, number) => T */
  ) {
    if (typeof elements !== 'function' && elements.length !== rows * columns) {
      throw new Error('Element/row/column count mismatch');
    }
    this._rows = rows;
    this._columns = columns;
    if (typeof elements === 'function') {
      this._elements = [];
      for (let i = 0; i < rows; i += 1) {
        for (let j = 0; j < columns; j += 1) {
          this._elements.push(elements(i, j));
        }
      }
    } else {
      this._elements = elements.slice();
    }
    if (this._elements.length === 0) {
      throw new Error('Empty matrix');
    }
  }

  zeroElement() /* : T */ {
    return this._elements[0].zero();
  }

  oneElement() /* : T */ {
    return this._elements[0].one();
  }

  toLaTeXString() /* : string */ {
    const rowStrs = [];
    for (let i = 0; i < this._rows; i += 1) {
      const row = this._elements.slice(
        i * this._columns,
        (i + 1) * this._columns
      );
      const rowStr = row.map(x => x.toString()).join(' & ');
      rowStrs.push(rowStr);
    }
    const elementStr = rowStrs.join(' \\\\\n');
    return `\\begin{pmatrix}
${elementStr}
\\end{pmatrix}`;
  }

  at(i /* : number */, j /* : number */) /* : T */ {
    if (i < 0 || i >= this._rows) {
      throw new RangeError('Row index out of bounds');
    }
    if (j < 0 || j >= this._columns) {
      throw new RangeError('Column index out of bounds');
    }
    return this._elements[i * this._columns + j];
  }

  times(n /* : Matrix<T> */) /* : Matrix<T> */ {
    if (this._columns !== n._rows) {
      throw new Error('Mismatched dimensions');
    }
    const columns = this._columns;
    return new Matrix(this._rows, n._columns, (
      i /* : number */,
      j /* : number */
    ) /* : T */ => {
      let t = this.zeroElement();
      for (let k = 0; k < columns; k += 1) {
        t = t.plus(this.at(i, k).times(n.at(k, j)));
      }
      return t;
    });
  }
}

// eslint-disable-next-line no-unused-vars
const newCauchyMatrix = /* :: <T: Field<*>> */ (
  x /* : T[] */,
  y /* : T[] */
) /* : Matrix<T> */ =>
  new Matrix(x.length, y.length, (i, j) =>
    x[i].one().dividedBy(x[i].minus(y[j]))
  );

/* ::
export { Matrix, newCauchyMatrix };
*/
