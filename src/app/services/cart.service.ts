import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from './../common/cart-item';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit {
 

  cartItems : CartItem[] = [];

  //storage:Storage = sessionStorage;
  storage:Storage = localStorage;

  totalPrice : Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity : Subject<number> = new BehaviorSubject<number>(0);
 
  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if(data!=null){
      this.cartItems = data;

      this.computeCartTotals();
    }
   }
 
 
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
  addToCart(theCartItem : CartItem){

    //CHECK IF WE ALREADY HAVE THE ITEM IN OUR CART
    let alreadyExistInCart : boolean = false;
    let existingCartItem : CartItem = undefined;

    if(this.cartItems.length>0){
    //FIND THE ITEM IN THE CART BASED ON ITEM ID
      
    existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
    //CHECK IF WE FOUND IT
    alreadyExistInCart = (existingCartItem!=undefined);
    }

    if(alreadyExistInCart){
      existingCartItem.quantity++;
    }
    else{
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and tool quality
    this.computeCartTotals();

  }

  computeCartTotals(){
    let totalPriceValue : number =0;
    let totalQuantityValue : number =0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue +=currentCartItem.quantity*currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    
      this.totalPrice.next(totalPriceValue);
      this.totalQuantity.next(totalQuantityValue);
    
      //log cart data
      this.logCartData( totalPriceValue, totalQuantityValue);
    

      this.persistCartItems();
  

    }
  

    persistCartItems(){
      this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
    }

    logCartData(totalPriceValue: number, totalQuantityValue: number) {
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name : ${tempCartItem.name},quantity =${tempCartItem.quantity},unitPrice =${tempCartItem.unitPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)},totalQuantity : ${totalQuantityValue}`);
    console.log('-----')
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity==0){
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    if(itemIndex>-1)
    {
      this.cartItems.splice(itemIndex,1);

      this.computeCartTotals();
    }
  }

}
