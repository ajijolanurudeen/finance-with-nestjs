import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
@Module({
    imports: [],
    controllers: [UsersController],
    providers:[UsersService]
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(AuthMiddleware)
          .forRoutes(UsersController); // Apply middleware to all routes in UserController
      }
}
