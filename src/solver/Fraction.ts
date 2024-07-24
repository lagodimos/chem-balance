import { gcd } from "./helpers/gcd";

export class Fraction {
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

    public add(frac: Fraction) {
        frac = new Fraction(
            this.getNumerator() * frac.getDenominator() +
                frac.getNumerator() * this.getDenominator(),
            this.getDenominator() * frac.getDenominator(),
        );
        frac.simplify();

        return frac;
    }

    public sub(frac: Fraction) {
        frac = new Fraction(
            this.getNumerator() * frac.getDenominator() -
                frac.getDenominator() * this.getDenominator(),
            this.getDenominator() * frac.getDenominator(),
        );
        frac.simplify();

        return frac;
    }

    public mul(frac: Fraction) {
        frac = new Fraction(
            this.getNumerator() * frac.getNumerator(),
            this.getDenominator() * frac.getDenominator(),
        );
        this.simplify();

        return frac;
    }

    public div(frac: Fraction) {
        frac = new Fraction(
            this.getNumerator() * frac.getDenominator(),
            frac.getNumerator() * this.getDenominator(),
        );
        this.simplify();

        return frac;
    }

    public inverted() {
        return new Fraction(this._denominator, this._numerator);
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
