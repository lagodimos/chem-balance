import { Fraction } from "../Fraction";

export class Matrix {
    private _values: Fraction[][];

    constructor(values: Fraction[][]) {
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
        const row: Fraction[] = [];

        for (let i = 0; i < this.columnCount(); i++) {
            row.push(this._values[r][i]);
        }
        return row;
    }

    public getColumn(c: number) {
        const column: Fraction[] = [];

        for (let i = 0; i < this.rowCount(); i++) {
            column.push(this._values[i][c]);
        }
        return column;
    }

    public copy() {
        const values: Fraction[][] = [];

        for (let row = 0; row < this.rowCount(); row++) {
            values.push(this.getRow(row));
        }

        return new Matrix(values);
    }

    public addRowBottom(row: Fraction[]) {
        if (row.length == this.columnCount()) {
            this._values.push(row);
        }
        return this;
    }

    public addColumnRight(column: Fraction[]) {
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
        const column: Fraction[] = [];
        let value: Fraction | undefined;

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
        let temp: Fraction;

        for (let col = 0; col < this.columnCount(); col++) {
            temp = this._values[r1][col];
            this._values[r1][col] = this._values[r2][col];
            this._values[r2][col] = temp;
        }
        return this;
    }

    public rowAdd(r1: number, scalar: Fraction, r2: number) {
        for (let col = 0; col < this.columnCount(); col++) {
            let frac = this._values[r2][col];
            frac = frac.add(this._values[r1][col].mul(scalar));
            this._values[r2][col] = frac;
        }
        return this;
    }

    public rowMul(r: number, scalar: Fraction) {
        for (let col = 0; col < this.columnCount(); col++) {
            let frac = this._values[r][col];
            frac = frac.mul(scalar);
            this._values[r][col] = frac;
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
                const frac = this._values[row][col];
                const pivot = this._values[col][col];
                if (pivot.getNumerator() != 0) {
                    if (col != row) {
                        let scalar = frac;
                        scalar = scalar.div(pivot);
                        scalar = scalar.mul(new Fraction(-1, 1));

                        this.rowAdd(col, scalar, row);
                    } else {
                        this.rowMul(row, frac.inverted());
                    }
                }
            }
        }
        return this;
    }

    public solve(b: Fraction[]) {
        // Ax=b
        const m = this.copy().addColumnRight(b).applyRowReduction();

        return m
            .getColumn(m.columnCount() - 1)
            .slice(
                0,
                m.rowCount() < m.columnCount() - 1
                    ? m.rowCount()
                    : m.columnCount() - 1,
            );
    }

    // For Debugging
    public printValues() {
        for (let i = 0; i < this._values.length; i++) {
            let row = "";
            for (let j = 0; j < this._values[i].length; j++) {
                const frac = this._values[i][j];
                row +=
                    frac.getNumerator().toString() +
                    "/" +
                    frac.getDenominator().toString() +
                    "  ";
            }
            console.log(row);
        }
    }
}
