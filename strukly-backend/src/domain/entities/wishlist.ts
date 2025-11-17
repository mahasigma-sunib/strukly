export class wishlist {
    id: string;
    itemName: string;
    itemPrice: number;
    progress: number;
    userID: string;

    createdAt: Date;
    updatedAt: Date;
    
    constructor(id: string, itemName: string, itemPrice: number, userID: string, createdAt: Date) {
        this.id = id;
        this.itemName = itemName;
        this.itemPrice = itemPrice;
        this.progress = 0;
        this.userID = userID;
        this.createdAt = createdAt;
        this.updatedAt = createdAt;
    }
}