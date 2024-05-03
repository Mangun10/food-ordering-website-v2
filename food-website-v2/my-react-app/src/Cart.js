import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCartItems()
  }, []);

  const fetchCartItems = async () => {
        try {
          const response = await axios.get('http://localhost:5000/cart', { withCredentials: true }); // Update URL with your backend endpoint
          // if (response.data && response.data.message === 'Cart not found') {
            // Handle the case where the cart is not found
            // console.log('Cart not found');
          // } else {
            // Process the cart items if available
            console.log('Received cart items:', response.data.totalAmount);
            setCartItems(response.data.items);
            setTotalPrice(response.data.totalAmount);
            updateTotalPrice(response.data.totalAmount);
          // }
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }

        
  };
  const updateItemQuantity = async (itemId, newQuantity) => {
    console.log(itemId);
    const response = await axios.put(`http://localhost:5000/cart/items/${itemId}`, { quantity: newQuantity });
    const updatedItems = cartItems.map(cartItem => {
      if (cartItem._id === itemId) {
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });
  
    setCartItems(updatedItems);
    updateTotalPrice(updatedItems);
  };
  

  const updateTotalPrice = (items) => {
    const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    setTotalPrice(totalPrice);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.put(`http://localhost:5000/cart/items/delete/${itemId}`); // Update URL with your backend endpoint
      fetchCartItems(); // Refresh cart items after removal
      alert("Item Deleted!");
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const checkout = ()=>{
    alert("Order placed! Thank You!")
    window.location.href = 'http://localhost:5000/user';
  }
  const goMenu = () =>{
    window.location.href = 'http://localhost:5000/menu';

  }

  return (
    <div className="cart">
      <h1>Your Shopping Cart</h1>
      <div className="cart-items">
      {cartItems && cartItems.length > 0 ? (
        cartItems.map(item => (
          <div key={item._id} className="cart-item">
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>Price: &#8377;{item.price}</p>
              <label htmlFor={`quantity-${item._id}`}>Quantity:</label>
              <input
                type="number"
                id={`quantity-${item._id}`}
                name={`quantity-${item._id}`}
                min="1"
                value={item.quantity}
                onChange={(e) => updateItemQuantity(item._id, parseInt(e.target.value, 10))}
              />
              <button className="remove-button" onClick={() => handleRemoveItem(item._id)}>Remove</button>
            </div>
          </div>
        ))) : (
          <p>No items in the cart</p>
        )}
      </div>
      <div className="total">
        <p>Total Items: {cartItems.length}</p>
        <p>Total Price: &#8377;{totalPrice.toFixed(2)}</p>
      </div>
      <button className="gohome" onClick={goMenu}>&larr; Go Back To Menu</button>
        <br></br><br></br>
      <button className="checkout-button" onClick={checkout} >Checkout</button>
    </div>
  );
};

export default Cart;


















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);

//   useEffect(() => {
//     fetchCartItems();
//   }, []);

//   const fetchCartItems = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/cart');
//       setCartItems(response.data);
//     } catch (error) {
//       console.error('Error fetching cart items:', error);
//     }
//   };

//   const handleRemoveItem = async (itemId) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`);
//       fetchCartItems();
//     } catch (error) {
//       console.error('Error removing item from cart:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Cart</h1>
//       <ul>
//         {cartItems.map((item) => (
//           <li key={item._id}>
//             {item.itemName} - Quantity: {item.quantity} - Price: {item.price}
//             <button onClick={() => handleRemoveItem(item._id)}>Remove</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Cart;


