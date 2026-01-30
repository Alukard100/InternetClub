export interface User {
    userId: number;
    username: string;
    total: number;
    status: 'Active' | 'Inactive';
    time: string;
}
