import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

export function Authentication(): ClassDecorator & MethodDecorator {
  return applyDecorators(UseGuards(AuthGuard));
}
