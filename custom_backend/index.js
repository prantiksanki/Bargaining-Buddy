const express = require('express'); 
const cors = require('cors');

const app = express();
const port = 5000;
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing form data


app.use(cors({ origin: "http://localhost:5173" }));

app.get("/products", (req, res) => {
    const products = [
      {
        id: "1",
        name: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
        image: "https://www.bhphotovideo.com/images/images2500x2500/sony_wh1000xm4_s_wh_1000xm4_wireless_noise_canceling_over_ear_1582976.jpg?height=300&width=300",
        description: "Industry-leading noise cancellation with Dual Noise Sensor technology",
        category: "Electronics",
        prices: [
          { retailer: "Amazon", price: 278.0, url: "#", inStock: true },
          { retailer: "Best Buy", price: 299.99, url: "#", inStock: true },
          { retailer: "Walmart", price: 289.0, url: "#", inStock: false },
          { retailer: "Target", price: 299.99, url: "#", inStock: true },
        ],
        lowestPrice: 278.0,
        highestPrice: 349.99,
        averagePrice: 298.0,
        priceHistory: [
          { date: "Jan", amazon: 349, bestbuy: 349, walmart: 349, target: 349 },
          { date: "Feb", amazon: 329, bestbuy: 349, walmart: 339, target: 349 },
          { date: "Mar", amazon: 329, bestbuy: 329, walmart: 329, target: 329 },
          { date: "Apr", amazon: 299, bestbuy: 329, walmart: 319, target: 329 },
          { date: "May", amazon: 299, bestbuy: 299, walmart: 299, target: 299 },
          { date: "Jun", amazon: 278, bestbuy: 299, walmart: 289, target: 299 },
        ],
      },
      {
        id: "2",
        name: "Apple Iphone 15 Pro",
        image: "https://www.iphoned.nl/wp-content/uploads/2023/02/iphone-16-ultra.jpg?height=300&width=300",
        description: "Industry-leading noise cancellation with Dual Noise Sensor technology",
        category: "Electronics",
        prices: [
          { retailer: "Amazon", price: 278.0, url: "#", inStock: true },
          { retailer: "Best Buy", price: 299.99, url: "#", inStock: true },
          { retailer: "Walmart", price: 289.0, url: "#", inStock: false },
          { retailer: "Target", price: 299.99, url: "#", inStock: true },
        ],
        lowestPrice: 278.0,
        highestPrice: 349.99,
        averagePrice: 298.0,
        priceHistory: [
          { date: "Jan", amazon: 349, bestbuy: 349, walmart: 349, target: 349 },
          { date: "Feb", amazon: 329, bestbuy: 349, walmart: 339, target: 349 },
          { date: "Mar", amazon: 329, bestbuy: 329, walmart: 329, target: 329 },
          { date: "Apr", amazon: 299, bestbuy: 329, walmart: 319, target: 329 },
          { date: "May", amazon: 299, bestbuy: 299, walmart: 299, target: 299 },
          { date: "Jun", amazon: 278, bestbuy: 299, walmart: 289, target: 299 },
        ],
      },
      {
        id: "3",
        name: "Samsung Phone",
        image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6441/6441107_sd.jpg",
        description: "Industry-leading noise cancellation with Dual Noise Sensor technology",
        category: "Electronics",
        prices: [
          { retailer: "Amazon", price: 278.0, url: "#", inStock: true },
          { retailer: "Best Buy", price: 299.99, url: "#", inStock: true },
          { retailer: "Walmart", price: 289.0, url: "#", inStock: false },
          { retailer: "Target", price: 299.99, url: "#", inStock: true },
        ],
        lowestPrice: 278.0,
        highestPrice: 349.99,
        averagePrice: 298.0,
        priceHistory: [
          { date: "Jan", amazon: 349, bestbuy: 349, walmart: 349, target: 349 },
          { date: "Feb", amazon: 329, bestbuy: 349, walmart: 339, target: 349 },
          { date: "Mar", amazon: 329, bestbuy: 329, walmart: 329, target: 329 },
          { date: "Apr", amazon: 299, bestbuy: 329, walmart: 319, target: 329 },
          { date: "May", amazon: 299, bestbuy: 299, walmart: 299, target: 299 },
          { date: "Jun", amazon: 278, bestbuy: 299, walmart: 289, target: 299 },
        ],
      },
      {
        id: "4",
        name: "Oneplus Buds 3",
        image: "https://th.bing.com/th/id/OIP.Ajl2bgWavnfvrWxFcrVL9AAAAA?rs=1&pid=ImgDetMain",
        description: "Industry-leading noise cancellation with Dual Noise Sensor technology",
        category: "Electronics",
        prices: [
          { retailer: "Amazon", price: 278.0, url: "#", inStock: true },
          { retailer: "Best Buy", price: 299.99, url: "#", inStock: true },
          { retailer: "Walmart", price: 289.0, url: "#", inStock: false },
          { retailer: "Target", price: 299.99, url: "#", inStock: true },
        ],
        lowestPrice: 278.0,
        highestPrice: 349.99,
        averagePrice: 298.0,
        priceHistory: [
          { date: "Jan", amazon: 349, bestbuy: 349, walmart: 349, target: 349 },
          { date: "Feb", amazon: 329, bestbuy: 349, walmart: 339, target: 349 },
          { date: "Mar", amazon: 329, bestbuy: 329, walmart: 329, target: 329 },
          { date: "Apr", amazon: 299, bestbuy: 329, walmart: 319, target: 329 },
          { date: "May", amazon: 299, bestbuy: 299, walmart: 299, target: 299 },
          { date: "Jun", amazon: 278, bestbuy: 299, walmart: 289, target: 299 },
        ],
      },
      {
        id: "5",
        name: "Lenovo 1380",
        image: "https://www.iphoned.nl/wp-content/uploads/2023/02/iphone-16-ultra.jpg?height=300&width=300",
        description: "Industry-leading noise cancellation with Dual Noise Sensor technology",
        category: "Electronics",
        prices: [
          { retailer: "Amazon", price: 278.0, url: "#", inStock: true },
          { retailer: "Best Buy", price: 299.99, url: "#", inStock: true },
          { retailer: "Walmart", price: 289.0, url: "#", inStock: false },
          { retailer: "Target", price: 299.99, url: "#", inStock: true },
        ],
        lowestPrice: 278.0,
        highestPrice: 349.99,
        averagePrice: 298.0,
        priceHistory: [
          { date: "Jan", amazon: 349, bestbuy: 349, walmart: 349, target: 349 },
          { date: "Feb", amazon: 329, bestbuy: 349, walmart: 339, target: 349 },
          { date: "Mar", amazon: 329, bestbuy: 329, walmart: 329, target: 329 },
          { date: "Apr", amazon: 299, bestbuy: 329, walmart: 319, target: 329 },
          { date: "May", amazon: 299, bestbuy: 299, walmart: 299, target: 299 },
          { date: "Jun", amazon: 278, bestbuy: 299, walmart: 289, target: 299 },
        ],
      }
    ];

    if (req.query.search) {
      const filteredProducts = products.filter(product =>
        product.id.includes(req.query.search)
      );
      res.json(filteredProducts);
    } else {
      res.json(products);
    }


    if (req.query.name) {
      const searchTerm = req.query.search.toLowerCase();
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
      );
      res.json(filteredProducts);
    } else {
      res.json(products);
    }
});

app.get("/search", (req, res) => {
    const results = [
        {
          id: "1",
          name: "Apple iPhone 15 Pro",
          image: "/placeholder.svg?height=200&width=200",
          category: "Electronics",
          lowestPrice: 999.0,
          savings: 200.0,
          retailers: 6,
          prices: [
            { retailer: "Amazon", price: 999.0, url: "#", inStock: true },
            { retailer: "Best Buy", price: 1099.0, url: "#", inStock: true },
            { retailer: "Walmart", price: 1049.0, url: "#", inStock: true },
            { retailer: "Target", price: 1099.0, url: "#", inStock: true }
          ]
        },
        {
          id: "2",
          name: 'Samsung 65" QLED 4K TV',
          image: "/placeholder.svg?height=200&width=200",
          category: "Electronics",
          lowestPrice: 1299.99,
          savings: 400.0,
          retailers: 5,
          prices: [
            { retailer: "Amazon", price: 1299.99, url: "#", inStock: true },
            { retailer: "Best Buy", price: 1499.99, url: "#", inStock: true },
            { retailer: "Walmart", price: 1399.99, url: "#", inStock: true },
            { retailer: "Target", price: 1499.99, url: "#", inStock: true }
          ]
        },
        {
          id: "3",
          name: "Dyson V12 Vacuum",
          image: "/placeholder.svg?height=200&width=200",
          category: "Home",
          lowestPrice: 499.99,
          savings: 100.0,
          retailers: 4,
          prices: [
            { retailer: "Amazon", price: 499.99, url: "#", inStock: true },
            { retailer: "Best Buy", price: 549.99, url: "#", inStock: true },
            { retailer: "Walmart", price: 529.99, url: "#", inStock: true },
            { retailer: "Target", price: 549.99, url: "#", inStock: true }
          ]
        },
        {
          id: "4",
          name: "Nike Air Max 270",
          image: "/placeholder.svg?height=200&width=200",
          category: "Fashion",
          lowestPrice: 129.99,
          savings: 50.0,
          retailers: 8,
          prices: [
            { retailer: "Amazon", price: 129.99, url: "#", inStock: true },
            { retailer: "Best Buy", price: 149.99, url: "#", inStock: true },
            { retailer: "Walmart", price: 139.99, url: "#", inStock: true },
            { retailer: "Target", price: 149.99, url: "#", inStock: true }
          ]
        }
    ];

    res.json(results);
});


app.get("/products/popular", (req, res) => {
    const popularProducts = [
        {
            id: "1",
            name: "Apple iPhone 15 Pro",  
            image: "https://www.iphoned.nl/wp-content/uploads/2023/02/iphone-16-ultra.jpg?height=300&width=300",
            description: "Industry-leading noise cancellation with Dual Noise Sensor technology",
            category: "Electronics",
            prices: [
                { retailer: "Amazon", price: 278.0, url: "#", inStock: true },
                { retailer: "Best Buy", price: 299.99, url: "#", inStock: true },   
            ],
            lowestPrice: 278.0,
            highestPrice: 349.99,
            averagePrice: 298.0,
            priceHistory: [
                { date: "Jan", amazon: 349, bestbuy: 349, walmart: 349, target: 349 },
                { date: "Feb", amazon: 329, bestbuy: 349, walmart: 339, target: 349 },
                { date: "Mar", amazon: 329, bestbuy: 329, walmart: 329, target: 329 },
                { date: "Apr", amazon: 299, bestbuy: 329, walmart: 319, target: 329 },
                { date: "May", amazon: 299, bestbuy: 299, walmart: 299, target: 299 },
                { date: "Jun", amazon: 278, bestbuy: 299, walmart: 289, target: 299 },
            ],
        }
    ];

    res.json(popularProducts);
});



app.get("/alerts", (req, res) => {
  const alerts = [
{
      id: "1",
      name: "Apple iPhone 15 Pro",
      price: 999.0,
      lowPrice: 900.0,
      highPrice: 1000.0,
      currentPrice: 950.0,
      url: "#",
      inStock: true,
      retailer: "Amazon",
      
    },
    {
      id: "2",
      name: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
      price: 999.0,
      lowPrice: 900.0,
      highPrice: 1000.0,
      currentPrice: 950.0,
      url: "#",
      inStock: true,
      retailer: "Amazon",
    },
    {
      id: "3",
      name: "Lenovo ThinkPad X1 Carbon",
      price: 999.0,
      lowPrice: 900.0,
      highPrice: 1000.0,
      currentPrice: 950.0,
      url: "#",
      inStock: true,
      retailer: "Amazon",
    },
    {
      id: "4",
      name: "HP Pavilion 15.6 inch Laptop",
      price: 999.0,
      lowPrice: 900.0,
      highPrice: 1000.0,
      currentPrice: 950.0,
      url: "#",
      inStock: true,
      retailer: "Amazon",
    }
  ] 

  res.json(alerts);
})


app.post("/signup", (req, res) => {
  const { email, password , name, agreeToTerms , confirmPassword} = req.body;
  
  if (email && password && name && agreeToTerms, confirmPassword) {
    console.log(email, password, name, agreeToTerms, confirmPassword);
    res.json({ message: "User created successfully" });
  } 
  else 
  {
    res.status(400).json({ message: "Invalid email or password" });
  }
});


app.post("/login" , (req,res)=>
{
  if(req.body.email && req.body.password && req.body.rememberMe)
  {
    console.log(req.query.email, req.query.password);
    res.json({message: "User logged in successfully"});
  }
  else
  {
    res.status(400).json({message: "Invalid email or password"});
  }
})


app.get("/popular" , (req,res)=>
{
  const popularProducts = [
    {
      id: "1",
      name: "Apple iPhone 15 Pro",
      image: "https://www.iphoned.nl/wp-content/uploads/2023/02/iphone-16-ultra.jpg?height=300&width=300",
      price: 999.0,
      lowPrice: 900.0,
      highPrice: 1000.0,
      currentPrice: 950.0,
      url: "#",
      inStock: true,
      retailer: "Amazon",
      category: "Electronics",
      description: "Industry-leading noise cancellation with Dual Noise Sensor technology",
    },
    {
      id: "2",
      name: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
      image: "https://www.bhphotovideo.com/images/images2500x2500/sony_wh1000xm4_s_wh_1000xm4_wireless_noise_canceling_over_ear_1582976.jpg?height=300&width=300",
      price: 999.0,
      lowPrice: 900.0,
      highPrice: 1000.0,
      currentPrice: 950.0,
      url: "#",
      inStock: true,
      retailer: "Amazon",
      category: "Electronics",
      description: "Industry-leading noise cancellation with Dual Noise Sensor technology",
    },
    {
      id: "3",
      name: "Lenovo ThinkPad X1 Carbon",
      image: "https://www.club386.com/wp-content/uploads/2022/05/Lenovo-ThinkPad-P16.jpg?height=300&width=300",
      price: 999.0,
      lowPrice: 900.0,
      highPrice: 1000.0,
      currentPrice: 950.0,
      url: "#",
      inStock: true,
      retailer: "Amazon",
      category: "Electronics",
      description: "Industry-leading noise cancellation with Dual Noise Sensor technology",
    },
    {
      id: "4",
      name: "HP Pavilion 15.6 inch Laptop",
      image: "https://www.startech.com.bd/image/cache/catalog/laptop/hp-laptop/15-cs3051tx/15-cs3051tx-4-500x500.jpg?height=300&width=300",
      price: 999.0,
      lowPrice: 900.0,
      highPrice: 1000.0,
      currentPrice: 950.0,
      url: "#",
      inStock: true,
      retailer: "Amazon",
      category: "Electronics",
      description: "Industry-leading noise cancellation with Dual Noise Sensor technology",
    }
  ] 
  res.json(popularProducts);
})
app.listen(port, (req,res) =>
{
    console.log(`Server is running on http://localhost:${port}`);
});