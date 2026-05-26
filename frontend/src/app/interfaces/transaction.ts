export interface Transaction {
    id: string;
    username: string;
    amount: number;
    currency: string;
    transactionType: number;
    date: Date;
}

export enum TransactionType {
    Online = 0,
    Offline = 1,
    Invalid = 2
}
