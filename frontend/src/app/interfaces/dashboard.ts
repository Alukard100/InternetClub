export interface DashboardDto {
    userCount: number;
    articleCount: number;
    monthlyEarnings: number;
    totalTransactions: number;
    paymentStats: PaymentMethodStatDto[];
    weeklyStats: WeeklyStatDto[];

}

export interface PaymentMethodStatDto {
    method: string;
    count: number;
}

export interface WeeklyStatDto {
    day: string;
    transactionCount: number;
    earnings: number;
}
