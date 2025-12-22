import { SetMetadata } from "@nestjs/common";

export const RequireAdmin = () => SetMetadata("isAdmin", true);


