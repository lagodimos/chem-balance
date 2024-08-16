import { Elements } from "./Elements";

export enum SubstanceType {
    Electron,
    Element, // Used to represent also a molecule or ion
    Compound,
}

export type Substance = {
    getType(): SubstanceType;
    getText(): string;
    getElementsCount(): Map<string, number>;
    getSubstances(): Substance[];
    getQuantity(): number;
    getCharge(): number;

    setQuantity(quantity: number): void;
    setCharge(charge: number): void;
};

export class Electron implements Substance {
    constructor() {}

    public getType = () => SubstanceType.Electron;
    public getText = () => "e";
    public getElementsCount = () => new Map<string, number>();
    public getSubstances = () => [];
    public getQuantity = () => 1;
    public getCharge = () => -1;

    public setQuantity() {
        throw new Error("Cannot set electron quantity");
    }
    public setCharge() {
        throw new Error("Cannot set charge on Electron-type Substance");
    }
}

export class Element implements Substance {
    private _symbol: string;
    private _quantity: number;
    private _charge: number;

    constructor(symbol: string, quantity?: number, charge?: number) {
        if (Elements.includes(symbol)) {
            this._symbol = symbol;
        } else {
            throw Error("No such element '" + symbol + "'");
        }

        this._quantity = quantity ?? 1;
        this._charge = charge ?? 0;
    }

    public getType = () => SubstanceType.Element;
    public getText = () => this._symbol;
    public getElementsCount() {
        const map = new Map<string, number>();
        map.set(this._symbol, this._quantity);
        return map;
    }
    public getSubstances = () => [];
    public getQuantity = () => this._quantity;
    public getCharge = () => this._charge;

    public setQuantity(quantity: number) {
        this._quantity = quantity;
        return this;
    }
    public setCharge(charge: number) {
        this._charge = charge;
    }
}

export class Compound implements Substance {
    private _substances: Substance[];
    private _quantity: number;
    private _charge: number;

    constructor(substances: Substance[], quantity?: number, charge?: number) {
        this._substances = substances;

        this._quantity = quantity ?? 1;
        this._charge = charge ?? 0;
    }

    public getType = () => SubstanceType.Compound;

    public getText() {
        let text = "";

        for (const substance of this._substances) {
            text += substance.getText();
        }
        return text;
    }

    public getElementsCount() {
        const map = new Map<string, number>();

        for (const substance of this._substances) {
            for (const [key, value] of substance.getElementsCount()) {
                map.set(key, value * this._quantity + (map.get(key) ?? 0));
            }
        }

        return map;
    }

    public getSubstances = () => this._substances;

    public getQuantity = () => this._quantity;
    public getCharge = () => this._charge;

    public setQuantity(quantity: number) {
        this._quantity = quantity;
        return this;
    }

    public setCharge(charge: number) {
        this._charge = charge;
    }
}
