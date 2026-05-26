export interface User {
    id: string;
    username: string;
    totalMoneySpent: number;
    status: number;
    availableSeconds: number;
    expiresAt?: Date;
}

export enum UserRole {
    User = 0,
    Admin = 1
}
