import { mapUsersDtoToDomain } from "../../infrastructure/mappers/user.mapper";
import { MOCK_USERS } from "../../infrastructure/mocks/users.mock";

/**
 * The domain mock for users, mapped from the DTO mock.
 * Note: The mapper expects an object with a 'users' key.
 */
export const MOCK_USERS_DOMAIN = mapUsersDtoToDomain({ users: MOCK_USERS });
