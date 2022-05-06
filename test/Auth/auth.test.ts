import { AuthService } from "./AuthService";
import { config } from "./config";

const authService = new AuthService();
authService.login(config.TEST_USER_NAME, config.TEST_USER_PASSWORD);
// console.log((user as any).signInUserSession.accessToken.jwtToken);
