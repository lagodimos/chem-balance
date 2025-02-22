import { gcd } from "./helpers/gcd";

export class Rational {
    private _numerator: number;
    private _denominator: number;

    constructor(numerator: number, denominator: number) {
        this._numerator = numerator;
        this._denominator = denominator;
        this.simplify();
    }

    public getValue() {
        return this._numerator / this._denominator;
    }

    public getNumerator(): number {
        return this._numerator;
    }

    public getDenominator() {
        return this._denominator;
    }

    public add(rational: Rational) {
        rational = new Rational(
            this.getNumerator() * rational.getDenominator() +
                rational.getNumerator() * this.getDenominator(),
            this.getDenominator() * rational.getDenominator(),
        );
        rational.simplify();

        return rational;
    }

    public sub(rational: Rational) {
        rational = new Rational(
            this.getNumerator() * rational.getDenominator() -
                rational.getDenominator() * this.getDenominator(),
            this.getDenominator() * rational.getDenominator(),
        );
        rational.simplify();

        return rational;
    }

    public mul(rational: Rational) {
        rational = new Rational(
            this.getNumerator() * rational.getNumerator(),
            this.getDenominator() * rational.getDenominator(),
        );
        this.simplify();

        return rational;
    }

    public div(rational: Rational) {
        rational = new Rational(
            this.getNumerator() * rational.getDenominator(),
            rational.getNumerator() * this.getDenominator(),
        );
        this.simplify();

        return rational;
    }

    public inverted() {
        return new Rational(this._denominator, this._numerator);
    }

    private simplify() {
        let num = gcd(Math.abs(this._numerator), Math.abs(this._denominator));

        if (this._denominator < 0) {
            num *= -1;
        }

        this._numerator /= num;
        this._denominator /= num;
    }
}
