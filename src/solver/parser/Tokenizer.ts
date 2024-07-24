export enum TokenType {
    Unknown,

    Element,
    Electron,
    Number,

    LParen,
    RParen,
    Plus,
    Minus,
    Caret,
    Equals,
    Space,
}

export class Token {
    private _type: TokenType;
    private _text: string;

    constructor(type: TokenType, text: string) {
        this._type = type;
        this._text = text;
    }

    public getType() {
        return this._type;
    }

    public getText() {
        return this._text;
    }
}

export class Tokenizer {
    private _text: string;
    private _curCharIdx: number;
    private _tokens: Token[];

    constructor() {
        this._text = "";
        this._curCharIdx = 0;
        this._tokens = [];
    }

    public getTokens(text: string) {
        this._text = text;
        this._curCharIdx = 0;
        this._tokens = [];

        while (this.hasNextChar()) {
            this.extractNextToken();
        }

        return this._tokens;
    }

    private hasNextChar() {
        return this._curCharIdx < this._text.length;
    }

    private nextChar() {
        this._curCharIdx++;
    }

    private prevChar() {
        this._curCharIdx--;
    }

    private getCurChar() {
        return this._text.charAt(this._curCharIdx);
    }

    private extractNextToken() {
        let type: TokenType = TokenType.Unknown;
        let text = this.getCurChar();

        if (this.getCurChar().match(/[A-Z]/)?.length == 1) {
            type = TokenType.Element;
            this.nextChar();
            if (this.getCurChar().match(/[a-z]/)) {
                text += this.getCurChar();
            } else {
                this.prevChar();
            }
        } else if (this.getCurChar() == "e") {
            type = TokenType.Electron;
        } else if (this.getCurChar().match(/[0-9]/)) {
            type = TokenType.Number;
            this.nextChar();
            while (this.hasNextChar() && this.getCurChar().match(/[0-9]/)) {
                text += this.getCurChar();
                this.nextChar();
            }
            this.prevChar();
        } else if (this.getCurChar() == "(") {
            type = TokenType.LParen;
        } else if (this.getCurChar() == ")") {
            type = TokenType.RParen;
        } else if (this.getCurChar() == "+") {
            type = TokenType.Plus;
        } else if (this.getCurChar() == "-") {
            type = TokenType.Minus;
        } else if (this.getCurChar() == "^") {
            type = TokenType.Caret;
        } else if (this.getCurChar() == "=") {
            type = TokenType.Equals;
        } else if (this.getCurChar() == " ") {
            type = TokenType.Space;
        }

        this.nextChar();
        this._tokens.push(new Token(type, text));
    }
}
