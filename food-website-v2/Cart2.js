const express = require('express');
const app = express();
const port = 3030;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Render the 'cart' template
app.get('/cart', (req, res) => {
    const userOrders = [
        { itemName: 'Shirt', itemDescription: 'Cotton T-shirt', quantity: 1, price: 44.00, totalPrice: 44.00 },
        // Add more order items as needed
    ];
    res.render('Cart2', { userOrders: userOrders });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
