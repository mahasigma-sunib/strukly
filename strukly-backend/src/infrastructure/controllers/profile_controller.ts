import { Request, Response } from 'express';
import UpdateUserProfileUseCase from '../../application/use_cases/update_user';

export default class ProfileController {
  constructor(
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase
  ){}

  public getProfile = async (req: Request, res: Response) => {
    return res.status(200).json({
      message: 'Profile fetched successfully',
      user: req.user,
    });
  };

  public updateProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const newData = req.body;

      await this.updateUserProfileUseCase.execute(userId, newData);

      return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}