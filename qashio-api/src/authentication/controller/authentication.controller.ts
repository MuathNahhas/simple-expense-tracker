import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from '../service/authentication.service';
import { SignInDto } from '../dto/sign-in.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authenticationService.signIn(
      signInDto.username,
      signInDto.password,
    );
  }
}
