import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common'

@Injectable()
export class MemberGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.startsWith('Bearer')
      ? request.headers.authorization.split(' ')[1]
      : request.headers.authorization
    console.log('request.headers;', request.headers)

    if (!token) {
      return Promise.reject(new UnauthorizedException())
    }

    if (token === process.env.ADMIN_TOKEN) {
      return Promise.resolve(true)
    }
    // const user = await this.userAuthRepo.findUserByToken(token)
    // if (user) {
    //   request.context = {
    //     ...(request.context || {}),
    //     company_id: user.company_id,
    //   }
    //   return Promise.resolve(true)
    // }
    return Promise.reject(new ForbiddenException())
  }
}
