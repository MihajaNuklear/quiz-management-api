/**
 * Dto used to reset user password
 */
export class updatePasswordDto {
    /**
     * The actual password
     */
    actualPassword: string;

    /**
     * The new password
     */
    newPassword: string;
}
