export class CreateUserDto{
    name!: string;
    lastName!: string;
    email!: string;
    password!: string;
    isPetAlertEnabled!: boolean
    lat!: number;
    lon!: number;
    radius!: number;
}