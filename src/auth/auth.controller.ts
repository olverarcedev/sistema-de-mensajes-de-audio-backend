import { Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }


    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request) {
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request & ({ user: { jwt: string } }), @Res() res: Response) {
        const { jwt } = req.user;
        res.cookie('token', jwt, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        });
        res.redirect("http://localhost:3001/messages");
    }

    @Get('verify-token')
    async verifyToken(@Req() req: Request, @Res() res: Response) {
        const token = req.cookies['token'] || req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('No access token found');
        }
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.userService.getUser(decoded.id);
            return res.json({ ...decoded, ...user });
        } catch (error) {
            throw new UnauthorizedException("Token expired or invalid");
        }
    }
    @Post('logout')
    logout(@Res() res: Response) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        });
        res.status(200).send({ message: 'Logout successfully' });
    }
}
