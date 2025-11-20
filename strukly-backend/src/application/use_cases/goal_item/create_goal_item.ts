import { IWishlistRepository } from "../../../domain/repositories/goal_item_repository";


export default class CreateWishlistUseCase {
  constructor(private readonly wishlistRepository: IWishlistRepository) { }

  async execute(
    userID: string,
    itemName: string,
    itemPrice: number,
  ) { 
    const newWishlist = await this.wishlistRepository.create({
      userID,
      itemName,
      itemPrice,
    });

    return newWishlist;
  }
}