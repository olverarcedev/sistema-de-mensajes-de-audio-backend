import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
        };
        const existingUser = await this.userService.getUserByEmail(user.email);
        if (!existingUser) {
            const newUser = await this.userService.createUser(user.firstName, user.email, user.picture);
            const jwtPayload = { id: newUser.id, email: newUser.email };
            const jwt = this.jwtService.sign(jwtPayload);
            done(null, { jwt });

        } else {
            const jwtPayload = { id: existingUser.id, email: existingUser.email };
            const jwt = this.jwtService.sign(jwtPayload);
            done(null, { jwt });
        }
    }
}
