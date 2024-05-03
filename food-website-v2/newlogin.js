const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const mongoose=require('mongoose');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
var http = require("http");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cors = require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/userdetails")
    .then(() => console.log("connected to mongo"))
    .catch((err) => console.log("error found",err));

const userSchema = mongoose.Schema({
    name: String,
    password: String,
    email: String,
    dob: String,
    mobile: String,
    address: String
});
const orderItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'details', required: true },
  userName: String,
  items: [orderItemSchema],
  totalAmount: Number,
  orderDate:{ type: Date, default: Date.now }
});


const orderModel = mongoose.model("orders", orderSchema);
const userModel = mongoose.model("details",userSchema);

app.get('/users/new',async function(req,res){
    res.cookie('name',req.query['name']);
    let name = req.query['name']
    let password = req.query['password']
    let email = req.query['email']
    let dob = req.query['dob']

    const newuser = new userModel({
        name: name,
        password: password,
        email: email,
        dob: dob,
        mobile: "",
        address: ""
    })
    const checkemail =await userModel.findOne({ email:email });
    if(!checkemail){

        const saveduser = await newuser.save();
        const newOrder = new orderModel({
            userId: saveduser._id ,
            userName: saveduser.name,
            items: [],
            totalAmount: 0,
        });
        await newOrder.save();
        res.cookie('orderid',newOrder._id,{sameSite: 'None', secure: true});
        res.redirect('/main.html');
    }
    else{
        res.send("user already exists");
    }
  });

  app.use(express.static(path.join(__dirname)));

app.get('/users/signin', async function(req,res){
    res.cookie('name',req.query['username']);
    // console.log(req.body);
    // res.send('<h1>User Name is' + req.query['username'] + '</h1>'+'<h1>password is '+ req.query['pass']+ '</h1>');
    let name = req.query['username']
    let password = req.query['password']
    // console.log(name);
    // console.log(password);
        try {
            const user = await userModel.findOne({ name: name });
            const newOrder = new orderModel({
              userId: user._id ,
              userName: user.name,
              items: [],
              totalAmount: 0,
              });
              await newOrder.save();
              res.cookie('orderid',newOrder._id,{sameSite: 'None', secure: true});

          if (user) {
              const result = (password === user.password);
              if (result) {
                res.redirect('/main.html');
              } else {
                // res.status(400).send("password doesn't match" );
                // console.error('Error:', error);
                res.send("password doesn't match" );
                // res.send('<script>alert("password doesn\'t match");</script>');
                // res.redirect('/newlogin.html');
              }
          } else {
            //   res.status(400).send( "User doesn't exist");
              res.send( "User doesn't exist");
            }
          } catch (error) {
            console.error('Error:', error); 
            res.status(400).json({ error });
          }
    
    
});

app.post('/additem', async (req, res) => {
  const name = req.cookies.name;
  const orderid= req.cookies.orderid;
  // console.log(req.cookies.name);
  // console.log(req.cookies.orderid);
  // console.log("current user "+req.body.itemName);
  const itemName = req.body.itemName; 
  console.log(itemName);
  const itemPrice= parseFloat(req.body.price);
  // const itemQuantity = parseInt(req.query.itemQuantity); // Assuming itemQuantity is an integer

  try {
      // Find the order by userId
      const userid= await userModel.findOne({name:name});
      if (!userid) {
          res.send('User not found.');
      }
      const userId = userid._id;
      // console.log("user id"+userId);
      
      const order = await orderModel.findOne({ _id: orderid });

      if (!order) {
          res.send('Order not found.');
      }
      // console.log("the order details"+order);
      console.log("item added");
      // Update the items array with the new item
      if (!order.items) {
        order.items = []; // Initialize items array if it doesn't exist
    }
    const existingItem = order.items.find(item => item.name === itemName);
      if(existingItem){
        existingItem.quantity+=1;
      }  
      else{
        order.items.push({
              name: itemName,
              price: itemPrice,
              quantity: 1
          });
      }

      // Recalculate the total amount based on the updated items
      order.totalAmount = calculateTotal(order.items);

      // Save the updated order back to the database
      const updatedOrder = await order.save();

  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Failed to add item to order.');
  }
});

// Helper function to calculate total amount based on items array
function calculateTotal(items) {
  console.log(items);
  return items.reduce((total, item) => total + item.quantity * item.price, 0);
}


app.get('/getdeets', async function(req,res){
  if(req.cookies !== null && req.cookies.name){
    // console.log(req.cookies);
    const name = req.cookies.name;
    const orderid= req.cookies.orderid;
    // console.log(orderid);
    // console.log(name);
    // res.json(name);
    const userData = await userModel.findOne({ name: name });
    // const userOrders = await orderModel.find({userId: userData._id});
    const userOrders = await orderModel.find({userId: userData._id}).sort({orderDate: -1});
    // console.log("entire order details are"+userOrders);
    // console.log(userOrders.orderDate);

    // htmlresponse = `<h1 class="display-2 text-white">Hello ${userData.name}!</h1>
    // <div class="user details"  id="details">
    //     <div id="userdata">
    //         <p>Email: ${userData.email}</p>
    //         <p>Date of Birth: ${userData.dob}</p>
    //     </div>
    //     <div class="previous-orders" id="porders">
    //         <h3>Previous Orders:</h3>
    //         <ul>
    //             ${orderData.items.map(item => `<li>${item.name} - Quantity: ${item.quantity}, Price: ${item.price}</li>`).join('')}
    //         </ul>
    //     </div>
    // </div>`;
    htmlresponse = `
    <h1 class="display-2 text-white">Hello ${userData.name}!</h1>
    <div class="user details" id="details">
        <div id="userdata">
            <p>Email: ${userData.email}</p>
            <p>Date of Birth: ${userData.dob}</p>
        </div>
        <div class="previous-orders" id="porders">
            <h3>Previous Orders:</h3>
            <ul>
                ${userOrders.map(order => `
                    <li>
                        Order ID: ${order._id}<br>
                        Date: ${order.orderDate ? order.orderDate.toString() : 'N/A'}<br>
                        Total Amount: ${order.totalAmount}<br>
                        Items:
                        <ul>
                            ${order.items.map(item => `
                                <li>${item.name} - Quantity: ${item.quantity}, Price: ${item.price}</li>
                            `).join('')}
                        </ul>
                    </li>
                `).join('')}
            </ul>
        </div>
    </div>`;
    res.send(htmlresponse);
  }
  else{
    res.send("<h2 style=\"color: white\">Please Login Again!</h2>")
  }

    // const orderData = await orderModel.findOne({userid:userData._id});
    // console.log(orderData);
})



app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000' // Replace with your React frontend URL
}));

app.get('/cart', async(req,res)=>{
  // const name = req.cookies.name;
  const orderid = req.cookies.orderid;
  console.log("the cart is working : "+orderid);
  // const userData = await userModel.findOne({ name: name });
  const userOrders = await orderModel.findOne({_id: orderid});
  // console.log(userOrders);
  console.log("userOrders.typeof:", typeof userOrders);
 
  if (userOrders) {
    // console.log("Sending userOrders:", userOrders);
    res.setHeader('Content-Type', 'application/json');
    res.json(userOrders);
  } else {
    res.json({ message: 'Cart not found' });
  }

});


//updating items
app.put('/cart/items/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const newQuantity = req.body.quantity; // Assuming quantity is passed in the request body

  try {
    // Find the order by item ID
    const order = await orderModel.findOne({ 'items._id': itemId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the item quantity in the order items array
    order.items.forEach(item => {
      if (item._id.toString() === itemId) {
        item.quantity = newQuantity;
      }
    });
    console.log("quantity updated")
    // Recalculate the total amount based on the updated items
    order.totalAmount = calculateTotal(order.items);
    console.log("total is "+order.totalAmount);

    // Save the updated order back to the database
    const updatedOrder = await order.save();

    res.status(200).json({ message: 'Item updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating item quantity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//deleting items
app.put('/cart/items/delete/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  console.log(itemId);
  try {
    // Find the order by item ID
    const order = await orderModel.findOne({ 'items._id': itemId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Remove the item from the order items array
    order.items = order.items.filter(item => item._id.toString() !== itemId);

    // Recalculate the total amount based on the updated items
    order.totalAmount = calculateTotal(order.items);
    // Save the updated order back to the database
    const updatedOrder = await order.save();

    res.status(200).json({ message: 'Item removed successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//redirecting to user page
app.get('/user', (req, res) => {
  res.sendFile(__dirname + '/user.html');
});
//redirecting to menu
app.get('/menu', (req, res) => {
  res.sendFile(__dirname + '/main.html');

});


app.get('/LogOut',async (req, res) => {
  console.log("Logout successful");
  res.clearCookie('name');
  res.clearCookie('orderid');
  console.log("Cookies after logout: ", req.cookies);
  await res.redirect('/newlogin.html');
});













app.listen(5000,function(){
    console.log('node server 5000 is working');
})