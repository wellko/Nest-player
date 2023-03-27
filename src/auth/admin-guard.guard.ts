import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/user.schema';
import { Model } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class AdminGuardGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const user = request.user as UserDocument | undefined;

    if (!user) {
      throw new Error('This guard works only after TokenAuth');
    }

    return user.role === 'admin';
  }
}
