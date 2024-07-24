import { TokenType, Token, Tokenizer } from "./Tokenizer";
import { ChemicalEquation } from "../chemical-equation/Equation";
import {
    Substance,
    Compound,
    Electron,
    Element,
    SubstanceType,
} from "../chemical-equation/Substance";

enum EquationSide {
    Left,
    Right,
}

export class Parser {
    private tokenizer: Tokenizer;
    private _tokens: Token[] = [];
    private _reactants: Substance[] = [];
    private _products: Substance[] = [];

    private _curTokenIdx: number = 0;

    constructor() {
        this.tokenizer = new Tokenizer();
        this._tokens = [];
        this._reactants = [];
        this._products = [];
    }

    private hasNextToken() {
        return this._curTokenIdx < this._tokens.length;
    }

    private getCurToken() {
        return this._tokens[this._curTokenIdx];
    }

    private nextToken() {
        this._curTokenIdx++;
    }

    private prevToken() {
        this._curTokenIdx--;
    }

    private removeSpaces() {
        for (let idx = 0; idx < this._tokens.length; idx++) {
            if (this._tokens[idx].getType() == TokenType.Space) {
                this._tokens.splice(idx, 1);
            }
        }
    }

    private checkForUnknownTokens() {
        for (const token of this._tokens) {
            if (token.getType() == TokenType.Unknown) {
                throw new Error("Unknown token: '" + token.getText() + "'");
            }
        }
    }

    public parseEquation(text: string) {
        this._tokens = this.tokenizer.getTokens(text);
        this._curTokenIdx = 0;
        this._reactants = [];
        this._products = [];

        let token: Token;
        let eqSide = EquationSide.Left;
        let substance: Substance;

        this.removeSpaces();
        this.checkForUnknownTokens();

        token = this.getCurToken();
        if (
            ![TokenType.Electron, TokenType.Element, TokenType.LParen].includes(
                token.getType(),
            )
        ) {
            throw new Error(
                "Equation cannot start with token '" + token.getText() + "'",
            );
        }

        while (this.hasNextToken()) {
            token = this.getCurToken();
            if (token.getType() == TokenType.Equals) {
                if (eqSide == EquationSide.Left) {
                    eqSide = EquationSide.Right;
                } else {
                    throw new Error("Second equal sign");
                }
                this.nextToken();
            } else if (
                [
                    TokenType.Electron,
                    TokenType.Element,
                    TokenType.LParen,
                ].includes(token.getType())
            ) {
                substance = this.parseSubstance();
                if (eqSide == EquationSide.Left) {
                    this._reactants.push(substance);
                } else {
                    this._products.push(substance);
                }

                if (
                    this.hasNextToken() &&
                    this.getCurToken().getType() == TokenType.Plus
                ) {
                    this.nextToken();

                    if (!this.hasNextToken()) {
                        throw new Error("Expected substance after '+'");
                    }
                }
            } else {
                throw new Error(
                    "Unexpected token '" + this.getCurToken().getText() + "'",
                );
            }
        }

        return new ChemicalEquation(this._reactants, this._products);
    }

    private parseSubstance() {
        const substances: Substance[] = [];
        let charge = 0;
        let resultSubstance: Substance = new Compound([]);

        let continueParsingSubstance = true;
        let token: Token;
        let substance: Substance;
        let quantity: number;

        while (continueParsingSubstance && this.hasNextToken()) {
            token = this.getCurToken();
            quantity = 1;

            if (token.getType() == TokenType.Element) {
                this.nextToken();

                substances.push(
                    new Element(token.getText(), this.parseQuantity()),
                );
            } else if (token.getType() == TokenType.Electron) {
                if (substances.length == 0) {
                    substances.push(new Electron());
                    this.nextToken();

                    if (this.getCurToken().getType() == TokenType.Caret) {
                        const startOfChargeValIdx = this._curTokenIdx;
                        charge = this.parseCharge();

                        if (charge != -1) {
                            this._curTokenIdx = startOfChargeValIdx;
                            token = this.getCurToken();
                            if (token.getText() == "1") {
                                this.nextToken();
                            }

                            throw new Error("Electron's charge is -1");
                        }
                    }
                } else {
                    throw new Error(
                        "An electron is not an element. Modify the charge instead",
                    );
                }

                continueParsingSubstance = false;
            } else if (token.getType() == TokenType.Caret) {
                if (substances.length != 0) {
                    charge = this.parseCharge();
                } else {
                    throw new Error("Elements not specified before charge");
                }

                continueParsingSubstance = false;
            } else if (token.getType() == TokenType.LParen) {
                this.nextToken();
                substance = this.parseSubstance();
                if (this.getCurToken().getType() != TokenType.RParen) {
                    throw new Error("Expected closing parenthesis");
                }
                this.nextToken();
                quantity = this.parseQuantity();
                substance.setQuantity(quantity);

                substances.push(substance);
            } else {
                // Equals Plus Minus RParen
                continueParsingSubstance = false;
            }
        }

        if (substances.length == 0) {
            throw new Error("Empty substance");
        } else if (substances.length == 1) {
            // If only one substance return only that.
            resultSubstance = substances[0];
        } else {
            resultSubstance = new Compound(substances);
        }

        if (resultSubstance.getType() != SubstanceType.Electron) {
            resultSubstance.setCharge(charge);
        }

        return resultSubstance;
    }

    private parseQuantity() {
        let quantity = 1;
        let token: Token;

        if (this.hasNextToken()) {
            token = this.getCurToken();

            // Check if it is specified
            if (token.getType() == TokenType.Number) {
                quantity = Number(token.getText());
                this.nextToken();
            }
        }
        return quantity;
    }

    private parseCharge() {
        let charge = 0;
        let token = this.getCurToken();

        if (token.getType() == TokenType.Caret) {
            this.nextToken();
            token = this.getCurToken();
            if (token.getType() == TokenType.Number) {
                charge = Number(token.getText());
                this.nextToken();
            } else if (
                [TokenType.Minus, TokenType.Plus].includes(token.getType())
            ) {
                charge = 1;
            } else {
                throw new Error("Expected charge value");
            }

            token = this.getCurToken();
            if (token.getType() == TokenType.Minus) {
                charge *= -1;
            } else if (token.getType() != TokenType.Plus) {
                let hasNumber = false;

                this.prevToken();
                token = this.getCurToken();
                if (token.getType() == TokenType.Number) {
                    hasNumber = true;
                }
                this.nextToken();

                throw new Error(
                    "Expected " +
                        (hasNumber ? "" : "a number or ") +
                        " +/- to indicate charge sign",
                );
            }

            this.nextToken();
        }

        return charge;
    }
}
