/**
 * Specifically does _not_ extend BaseUser as the types of `userId` are not compatible.
 */
export interface CreateUserEntity {
  emailAddress: string;
  /**
   * On the backend this is a DateTime and must be parseable as such
   */
  expirationDate: string;
  fullName: string;
  password: string;
  /**
   * All other userId fields are numbers. Backend for this model has it as a string and that is respected here.
   */
  userId: string;
  userName: string;
}
