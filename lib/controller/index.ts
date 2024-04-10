import type { Request, Response } from 'express';
import { raw } from 'express';
import type { IUser } from '../DB/Models/User';
import { PointsService } from '../services/PointsService';
import { ViewService } from '../services/ViewService';
import { UserService } from '../services/User';

interface RequestValidatedByPassport extends Request {
  user: {
    userId: string;
    accessToken: string;
    phoneNumber: string,
    iat: number,
    exp: number,
  }
}

interface RequestInterferedByIsBlocked extends RequestValidatedByPassport {
  currentUser: IUser
}


class RewardsServiceController {
  public static async getUserPoints(req: RequestInterferedByIsBlocked, res: Response) {
    const { id: userId } = req.currentUser;

    const points = await UserService.getPoints(userId);
    return res.send({
      points
    });
  }

  public static async getUserPointsForPost(req: RequestInterferedByIsBlocked, res: Response) {
    const { postId } = req.params;
    const { id: userId } = req.currentUser;
    const postPoints = await PointsService.getUserTotalPointsForPost(postId, userId);

    return res.send({
      postPoints,
    });
  }

  public static async getPostViews(req: RequestInterferedByIsBlocked, res: Response) {
    const { postId } = req.params;
    const views =  await ViewService.getPostViews(postId);
    return res.send({
      views
    });
  }

  public static async getUserPostsWithPoints(req: RequestInterferedByIsBlocked, res: Response) {
    const { id: userId } = req.currentUser;
    const userPostPoints = await PointsService.getUserPostPoints(userId);

    return res.send({
      data: userPostPoints
    });
  }
}

export {
  RewardsServiceController
};