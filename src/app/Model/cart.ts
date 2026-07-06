export interface Cart {
    items: Array<CartItem>;
}

export interface CartItem {
    productId: string,
    quantity: number;
    unit: number,
    mass: MassEnum | string | any;
}


export enum MassEnum {
    gm = 'gm',
    Kg = 'Kg',
    ml = 'ml',
    L = 'L'
}