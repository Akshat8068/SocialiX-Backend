import type { User } from "../modules/users/user.entity.ts";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export {}