export function gcd(num1: number, num2: number) {
    let remainder: number;

    while (num2 != 0) {
        remainder = num1 % num2;
        num1 = num2;
        num2 = remainder;
    }
    return num1;
}
