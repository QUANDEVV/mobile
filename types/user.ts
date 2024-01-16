export interface User {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    gender: string;
    DOB: string;
    password: string;
    confirm_password: string;
    user_type: string;
}

export interface Login {
    email: string;
    password: string;
}

export interface ForgotPassword {
    email: string;
}

export interface ResetPassword {
    password: string;
    confirm_password: string;
}

export interface ChangePassword {
    old_password: string;
    new_password: string;
}

export interface UpdateProfile {
    first_name: string;
    last_name: string;
    phone: string;
}

export interface UpdateProfileImage {
    profile_image: string;
}
