import type mongoose from 'mongoose';
import type { IPost } from '../DB/Models/Post';
import PostPointsModel from '../DB/Models/Post-points.schema';
import { UserService } from './User';
import {SNSService} from "./SNS";

export class PointsService {
  public static async givePointsForPost(postId: mongoose.Types.ObjectId
  | string, userId: mongoose.Types.ObjectId  | string, points: number, shouldUpdateUserPoints = false) {
    try {
      const postPointUpdated =await PostPointsModel.findOneAndUpdate({
        postId,
        userId
      }, {
        points,
      }, { new: true });
      console.log('--------------------- addPoints userUpdated: ', postPointUpdated);
      // SNS Event
      if (postPointUpdated) {
        SNSService.updatePostPointsRewards(postPointUpdated);
      }

      // add points to the user profile
      try {
        if (shouldUpdateUserPoints)
          await UserService.addPoints(userId, points);
      } catch (error) {
        // TODO put back in queue to process later
        console.log('adding-points-to-user-profile-error', error);
      }
    } catch (error) {
      // TODO put back in queue to process later
      console.log('adding-points-to-post-error', error);
    }

  }
  static async postViewPoint(post: IPost, totalViews: number) {
    try {
      // For every 50 views give points
      if (totalViews % 2 === 0) { // TODO change to 50
        const currentPostPoints = await PostPointsModel.findOne({
          postId: post._id,
          userId: post.userId // just extra condition got safe case, only postId is also works fine
        });
        if (currentPostPoints) {
          const currentPoints = currentPostPoints.points;
          const newPoints = Math.ceil(((totalViews * 0.2) - currentPoints) + 50);
          const totalNewPoints = currentPoints + newPoints;

          await this.givePointsForPost(post._id, post.userId, totalNewPoints, false);
          await UserService.addPoints(post.userId, totalNewPoints - 50);
        }


      }
    } catch (error) {
      // TODO put back in queue to process later
      console.log('postViewReward-error', error);
    }
  }

  static async initPostPoints(postId: mongoose.Types.ObjectId  | string, userId: mongoose.Types.ObjectId  | string) {
    // init post Points document
    const newPostPoints = new PostPointsModel({
      userId,
      postId,
      points: 0
    });
    return newPostPoints.save();
  }

  static async postPublished(post: IPost) {
    return  this.givePointsForPost(post._id, post.userId, 50, true);
  }

  public static async getUserTotalPointsForPost(postId: mongoose.Types.ObjectId
  | string, userId: mongoose.Types.ObjectId | string) {
    const postPoints = await PostPointsModel.findOne({
      postId,
      userId
    });

    return postPoints?.points ? postPoints.points : 0;
  }

  public static async getUserPostPoints(userId: mongoose.Types.ObjectId | string) {
    const userPostsPoints = await PostPointsModel.find({
      userId
    })
      .populate('postId').sort({
        createdAt: 'descending'
      });
    return userPostsPoints;
  }
}