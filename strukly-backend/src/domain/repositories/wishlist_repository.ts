import Wishlist from "../aggregates/wishlist";
import WishlistID from "../values/wishlist_id";
import UserID from "../values/user_id";

export default interface IWishlistRepository {
    create: (wishlist: Wishlist) => Promise<Wishlist>;
    delete: (wishlistID: WishlistID) => Promise<void>;
    findByID: (wishlistID: WishlistID) => Promise<Wishlist | null>;
    findByUserID: (userID: UserID) => Promise<Wishlist[]>;
    update: (wishlist: Wishlist) => Promise<Wishlist>;
}