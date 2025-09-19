import { Request, Response } from 'express';
import UpdateUserProfileUseCase from '../../application/use_cases/update_user';
import UserRepository from '../../domain/repositories/user_repository';

export default class ProfileController {
  constructor(
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly userRepository: UserRepository
  ){}

public getProfile = async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }
    
    const { hashedPassword, ...userProfile } = user;
    return res.status(200).json({
      message: 'Profile fetched successfully',
      user: userProfile,
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