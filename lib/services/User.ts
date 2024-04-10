import UserModel from '../DB/Models/User';
import UserTokenBlacklistModel from '../DB/Models/User-Token-Blacklist';
import type mongoose from 'mongoose';

class UserService{

  static async createUserByPhone(userObject: any, userId: string) {
    try {
      // check if user already exists
      const existingUser = await this.findById(userId);
      if (existingUser) throw new Error('User With Given Id already exists');
      const user = new UserModel({ ...userObject  });
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id: string) {
    return UserModel.findById(id);
  }

  static async addTokenInBlackList(accessToken: string) {
    const blackListToken = new UserTokenBlacklistModel({
      token: accessToken,
    });
    return blackListToken.save();
  }

  private static async _update(id: string, updateUserDto: any) {
    return UserModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }


  static async updateUser(userId: string, updateDto: any) {
    return this._update(userId, updateDto);
  }

  public static async tokenInBlackList(accessToken: string) {
    return UserTokenBlacklistModel.findOne({
      token: accessToken
    });
  }

  public static async addPoints(userId: mongoose.Types.ObjectId  | string, pointsToAdd: number = 0) {
    const user = await UserModel.findById(userId);
    if (user) {
      const newPoints = user.points + pointsToAdd;
      await UserModel.findByIdAndUpdate(userId, {
        points: newPoints
      });
    }
    return true;
  }

  public static async getPoints(userId: mongoose.Types.ObjectId  | string) {
    const user = await UserModel.findById(userId);

    return user?.points ? user.points : 0;
  }

}


export {
  UserService
};