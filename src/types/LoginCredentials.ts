export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginStatus {
    status: string;
    token?: string;
    username: string;
}