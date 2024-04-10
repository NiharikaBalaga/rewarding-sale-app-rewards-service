import type mongoose from 'mongoose';
import type { Response } from 'express';
import PostViewModel from '../DB/Models/Post-View.schema';
import { PointsService } from './PointsService';
import PostModel from '../DB/Models/Post';

export class ViewService {
  static async getPostViews(postId: mongoose.Types.ObjectId | string) {
    const postViews = await PostViewModel.countDocuments({
      postId
    });
    return postViews;
  }

  static async updatePostView(postId: mongoose.Types.ObjectId | string, viewedByUserId: mongoose.Types.ObjectId | string) {
    try {

      const post = await PostModel.findById(postId);
      if (post?.userId.equals(viewedByUserId)) {
        // same user view event
        return false;
      }

      // check if user viewed the post already
      const userViewedPostAlready = await PostViewModel.findOne({
        postId,
        userId: viewedByUserId
      });

      if (userViewedPostAlready)
        return false;


      await new PostViewModel({
        postId,
        userId: viewedByUserId
      }).save();

      const totalViews = await PostViewModel.countDocuments({
        postId,
      });

      // Unique View check to give points ot not
      await PointsService.postViewPoint(post!, totalViews);
      return true;
    } catch (error) {
      console.log('error-in-updatePostView', error);
      return false;
    }
  }
}