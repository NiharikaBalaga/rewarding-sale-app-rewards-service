import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';
import UserModel from './User';
import PostModel from './Post';

export interface IPostViewSchema extends Document {
  userId?: mongoose.Types.ObjectId,
  postId: mongoose.Types.ObjectId,
}
const PostViewsSchema: mongoose.Schema  = new mongoose.Schema({
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
}, {
  collection: 'PostViews',
  timestamps: true,
  id: true,
});


const PostViewModel: Model<IPostViewSchema> = mongoose.model<IPostViewSchema>('PostViews', PostViewsSchema);

export default PostViewModel;