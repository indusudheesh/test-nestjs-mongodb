import { Injectable, NestMiddleware,HttpStatus,Req } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req:Request, res: Response, next: NextFunction) {
    interface JwtPayload {
      _id: string
    }
    const token = req.header("Authorization");
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: false,
        message: "Invalid token format",
      });
    }    
    let userId
    try {
      const tokenWithoutBearer = token.replace("Bearer ", "");    
    let tokenDetails=jwt.verify(tokenWithoutBearer, "secretforjsonwebtoken") as JwtPayload;
    userId=tokenDetails._id;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          status: false,
          message: "Token expired, please login again",
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          status: false,
          message: "Invalid token, please login again",
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: false,
          message: "An unexpected error occurred",
        });
      }
    }
    req.headers['authorId']=userId
    next();
  }
}