// src/middleware/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { user } from 'src/users/entities/user.entities';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(user)
    private readonly userRepository: Repository<user>,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const token = req.headers['authorization'];
    if (!token) throw new UnauthorizedException('No token provided');

    const user = await this.userRepository.findOne({ where: { token } });
    if (!user) throw new UnauthorizedException('Invalid token');

    req.user = user; // attach the user to the request
    next();
  }
}
