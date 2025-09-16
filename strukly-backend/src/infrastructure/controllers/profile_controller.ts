import { Request, Response } from 'express';

export default class ProfileController {
  public getProfile = async (req: Request, res: Response) => {
    return res.status(200).json({
      message: 'Profile fetched successfully',
      user: req.user,
    });
  };
}