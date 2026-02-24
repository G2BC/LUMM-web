import { registerAuthInterceptor } from "@/api/auth-interceptor";
import { registerErrorInterceptor } from "@/api/errors-interceptor";

registerAuthInterceptor();
registerErrorInterceptor();
