import type { IUser } from '../modules/users/users.interface.js'; 

declare global {
  namespace Express {
    // We override the empty 'User' interface with OUR interface
    interface User extends IUser {}
  }
}