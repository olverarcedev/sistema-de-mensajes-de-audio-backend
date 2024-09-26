import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { UserService } from 'src/user/user.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'google' }),
    ],
    controllers: [AuthController],
    providers: [GoogleStrategy, UserService],
})
export class AuthModule { }
