import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';
import UserModel from './User';
import PostModel from './Post';


export interface IPostPointsSchema extends Document {
  userId: mongoose.Types.ObjectId,
  postId: mongoose.Types.ObjectId,
  points: number,
}
const PostPointsSchema: mongoose.Schema  = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: UserModel, // Connection user collection - useful during popular operations
    index: true,
  },

  postId: {
    type: mongoose.Types.ObjectId,
    ref: PostModel,
    required: true,
    index: true,
  },

  points: {
    type: Number,
    default: 0
  }

}, {
  collection: 'PostPoints',
  timestamps: true,
  id: true,
});


const PostPointsModel: Model<IPostPointsSchema> = mongoose.model<IPostPointsSchema>('PostPoints', PostPointsSchema);

export default PostPointsModel;