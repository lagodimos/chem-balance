import { Rational } from "../Rational";

export class Matrix {
    private _values: Rational[][];

    constructor(values: Rational[][]) {
        this._values = values;
    }

    public rowCount() {
        return this._values.length;
    }

    public columnCount() {
        return this._values[0].length;
    }

    public getDimensions() {
        return [this.rowCount(), this.columnCount()];
    }

    public getValue(row: number, column: number) {
        return this._values[row][column];
    }

    public getRow(r: number) {
        const row: Rational[] = [];

        for (let i = 0; i < this.columnCount(); i++) {
            row.push(this._values[r][i]);
        }
        return row;
    }

    public getColumn(c: number) {
        const column: Rational[] = [];

        for (let i = 0; i < this.rowCount(); i++) {
            column.push(this._values[i][c]);
        }
        return column;
    }

    public copy() {
        const values: Rational[][] = [];

        for (let row = 0; row < this.rowCount(); row++) {
            values.push(this.getRow(row));
        }

        return new Matrix(values);
    }

    public addRowBottom(row: Rational[]) {
        if (row.length == this.columnCount()) {
            this._values.push(row);
        }
        return this;
    }

    public addColumnRight(column: Rational[]) {
        if (column.length == this.rowCount()) {
            for (let row = 0; row < this.rowCount(); row++) {
                this._values[row].push(column[row]);
            }
        }
        return this;
    }

    public removeBottomRow() {
        return this._values.pop();
    }

    public removeRightColumn() {
        const column: Rational[] = [];
        let value: Rational | undefined;

        for (const row of this._values) {
            value = row.pop();
            if (value !== undefined) {
                column.push(value);
            } else {
                throw new Error("Right column contains undefined value");
            }
        }

        return column;
    }

    public swapRows(r1: number, r2: number) {
        let temp: Rational;

        for (let col = 0; col < this.columnCount(); col++) {
            temp = this._values[r1][col];
            this._values[r1][col] = this._values[r2][col];
            this._values[r2][col] = temp;
        }
        return this;
    }

    public rowAdd(r1: number, scalar: Rational, r2: number) {
        for (let col = 0; col < this.columnCount(); col++) {
            let value = this._values[r2][col];
            value = value.add(this._values[r1][col].mul(scalar));
            this._values[r2][col] = value;
        }
        return this;
    }

    public rowMul(r: number, scalar: Rational) {
        for (let col = 0; col < this.columnCount(); col++) {
            let value = this._values[r][col];
            value = value.mul(scalar);
            this._values[r][col] = value;
        }
        return this;
    }

    public applyRowReduction() {
        for (
            let col = 0;
            col < this.rowCount() && col < this.columnCount();
            col++
        ) {
            // Move a row with a pivot in the current row, if exists
            // and the current one has a zero in [row][row] position
            for (
                let i = col;
                i < this.rowCount() &&
                this._values[col][col].getNumerator() == 0;
                i++
            ) {
                if (this._values[i][col].getNumerator() != 0) {
                    this.swapRows(col, i);
                }
            }

            for (let row = 0; row < this.rowCount(); row++) {
                // apply Gaussian elimination
                const value = this._values[row][col];
                const pivot = this._values[col][col];
                if (pivot.getNumerator() != 0) {
                    if (col != row) {
                        let scalar = value;
                        scalar = scalar.div(pivot);
                        scalar = scalar.mul(new Rational(-1, 1));

                        this.rowAdd(col, scalar, row);
                    } else {
                        this.rowMul(row, value.inverted());
                    }
                }
            }
        }
        return this;
    }

    public solve(b: Rational[]) {
        /**
         * Returns the solution to the equation Ax=b
         */

        let solution: Rational[] = [];
        const m = this.copy().addColumnRight(b).applyRowReduction();

        // Check if the system has a solution
        for (let row = 0; row < m.columnCount() && row < m.rowCount(); row++) {
            if (
                (m.getValue(row, row).getValue() == 0 &&
                    m.getValue(row, m.columnCount() - 1).getValue() != 0) ||
                (m.getValue(row, row).getValue() != 0 &&
                    row == m.columnCount() - 1)
            ) {
                throw new NoSolutionError();
            }
        }

        // Check for multiple solutions
        const k = m.columnCount() - 2;
        if (m.rowCount() < k + 1 || m.getValue(k, k).getValue() == 0) {
            throw new MultipleSolutionsError();
        }

        solution = m
            .getColumn(m.columnCount() - 1)
            .slice(
                0,
                m.rowCount() < m.columnCount() - 1
                    ? m.rowCount()
                    : m.columnCount() - 1,
            );

        return solution;
    }

    // For Debugging
    public printValues() {
        for (let i = 0; i < this._values.length; i++) {
            let row = "";
            for (let j = 0; j < this._values[i].length; j++) {
                const value = this._values[i][j];
                row +=
                    value.getNumerator().toString() +
                    "/" +
                    value.getDenominator().toString() +
                    "  ";
            }
            console.log(row);
        }
    }
}

export class NoSolutionError extends Error {
    constructor() {
        super("No solution");
        this.name = "NoSolutionError";
    }
}

export class MultipleSolutionsError extends Error {
    constructor() {
        super("Multiple solutions");
        this.name = "MultipleSolutionsError";
    }
}
