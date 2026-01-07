import { Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service.js';
import { UpdateProfileDto, UpdateSettingsDto } from './dto/user.dto.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth() 
@Controller('users') // API prefix sẽ là /users
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me') // GET /users/me
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile') // PATCH /users/profile
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('settings') // PATCH /users/settings
  updateSettings(@Request() req, @Body() dto: UpdateSettingsDto) {
    return this.userService.updateSettings(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('onboarding') // POST /users/onboarding
  finishOnboarding(@Request() req) {
    return this.userService.finishOnboarding(req.user.id);
  }
}