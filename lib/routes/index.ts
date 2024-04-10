import express from 'express';
import passport from '../strategies/passport-strategy';
import { isBlocked, tokenBlacklist } from '../middlewares';
import { RewardsServiceController } from '../controller';
import { postIdPathParam, validateErrors } from './RequestValidations';
const router = express.Router();


function getRouter() {
  router.get('/hello', (req, res) => {
    res.send({ message: 'Hello Reward' });
  });

  router.get('/user/points', [passport.authenticate('jwt-access', { session: false }),
    isBlocked, tokenBlacklist, validateErrors, RewardsServiceController.getUserPoints]);

  router.get('/user/:postId/points', [passport.authenticate('jwt-access', { session: false }),
    isBlocked, tokenBlacklist, postIdPathParam(), validateErrors, RewardsServiceController.getUserPointsForPost]);

  router.get('/views/:postId', [passport.authenticate('jwt-access', { session: false }),
    isBlocked, tokenBlacklist, postIdPathParam(), validateErrors, RewardsServiceController.getPostViews]);

  router.get('/user-posts-points', [passport.authenticate('jwt-access', { session: false }),
    isBlocked, tokenBlacklist, validateErrors, RewardsServiceController.getUserPostsWithPoints]);

  return router;
}

export const routes = getRouter();