import {Money} from "../types/Money";

export const toMoney = (amount: string): Money => ({
    amount: parseFloat(amount),
    currency: 'EUR'
})
