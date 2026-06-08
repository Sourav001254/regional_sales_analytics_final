import fs from 'fs';
import path from 'path';

function generateData() {
    console.log("Generating synthetic data...");
    const rows = [];
    rows.push("Order_ID,Date,Region,State,City,Customer_Name,Customer_Segment,Product_Name,Product_Category,Units_Sold,Unit_Price,Discount_%,Revenue,COGS,Profit,Profit_Margin_%,Return_Flag,Customer_ID,Customer_Rating,Delivery_Days,Sales_Rep_Name,Channel");
    
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const categories = ['Electronics', 'Furniture', 'Apparel', 'Food'];
    
    for(let i=0; i<500; i++) {
        const date = new Date(new Date('2022-01-01').getTime() + Math.random() * (new Date('2023-12-31').getTime() - new Date('2022-01-01').getTime()));
        const region = regions[Math.floor(Math.random()*regions.length)];
        const category = categories[Math.floor(Math.random()*categories.length)];
        const units = Math.floor(Math.random() * 100) + 1;
        const price = (Math.random() * 490 + 10).toFixed(2);
        const discount = (Math.random() * 0.3).toFixed(2);
        const revenue = (units * Number(price) * (1 - Number(discount))).toFixed(2);
        const cogs = (units * Number(price) * 0.4).toFixed(2);
        const profit = (Number(revenue) - Number(cogs)).toFixed(2);
        const margin = ((Number(profit) / Number(revenue)) * 100).toFixed(2);
        const returnFlag = Math.random() < 0.05 ? 1 : 0;
        
        rows.push(`ORD-${1000+i},${date.toISOString().split('T')[0]},${region},Unknown,CityX,Cust${i},Consumer,Prod${i},${category},${units},${price},${(Number(discount)*100).toFixed(0)},${revenue},${cogs},${profit},${margin},${returnFlag},CUST-${Math.floor(Math.random()*100)},4,${Math.floor(Math.random()*10+1)},RepA,Online`);
    }
    
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    
    fs.writeFileSync(path.join(dir, 'synthetic_sales_data.csv'), rows.join('\n'));
    console.log("synthetic_sales_data.csv generated in /data folder.");
}

generateData();
