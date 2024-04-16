export class UserRoleDto {
    _id: string
    name: string
    description: string;
    group: string
    privileges: [string]
}