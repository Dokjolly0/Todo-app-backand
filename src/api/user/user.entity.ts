export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  picture: string;
  openDate: Date;
  isActive: boolean;
  confirmationCode?: string;
}
