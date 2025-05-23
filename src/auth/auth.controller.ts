import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CreateUserDto } from 'src/users/dtos';
import { JwtAuthGuard, LocalAuthGuard, RefreshJwtAuthGuard } from './guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/schemas';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: UserDocument, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.refreshToken(user);
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: parseInt(process.env.COOKIE_ACCESS_EXPIRES_AGE) || 1000 * 60 * 60 * 4 });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: parseInt(process.env.COOKIE_REFRESH_EXPIRES_AGE) || 1000 * 60 * 60 * 24 * 4 });
    user.refreshToken = refreshToken;
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "login success",
      data: user,
    });
  }

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { user, token } = await this.authService.register(createUserDto);
    res.cookie("accessToken", token.accessToken, { httpOnly: true, maxAge: parseInt(process.env.COOKIE_ACCESS_EXPIRES_AGE) || 1000 * 60 * 60 * 4 });
    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true, maxAge: parseInt(process.env.COOKIE_REFRESH_EXPIRES_AGE) || 1000 * 60 * 60 * 24 * 4
    });
    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "register success",
      data: user,
    });
  }

  @Post("refresh-token")
  @UseGuards(RefreshJwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async refreshToken(@CurrentUser() user: UserDocument, @Req() req: Request, @Res() res: Response) {
    const oldRefreshToken = req.cookies.refreshToken as string;
    await this.authService.validateRefreshToken(user._id.toString(), oldRefreshToken);
    const { accessToken, refreshToken } = await this.authService.refreshToken(user);
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: parseInt(process.env.COOKIE_ACCESS_EXPIRES_AGE) || 1000 * 60 * 60 * 4 });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: parseInt(process.env.COOKIE_REFRESH_EXPIRES_AGE) || 1000 * 60 * 60 * 24 * 4 });
    user.refreshToken = refreshToken;
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "refresh token success",
      data: {
        accessToken,
        refreshToken,
      }
    });
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async logout(@CurrentUser() user: UserDocument, @Res() res: Response) {
    await this.authService.logout(user);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "logout success",
    });
  }
}
