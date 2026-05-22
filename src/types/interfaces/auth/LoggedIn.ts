export interface LoggedIn {
    id: string,
    name: string,
    is_admin: boolean,
    user_type: number,
    branch_id: string,
    company_id: string,
    access_token: string,
    expires_in: number,
    // branches: Array<Branch>,
    access_permission_type: number
}
