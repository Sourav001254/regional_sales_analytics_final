import fs from 'fs';
import path from 'path';

export interface SalesRecord {
  Order_ID: string;
  Date: string;
  Region: string;
  State: string;
  City: string;
  Customer_ID: string;
  Customer_Name: string;
  Customer_Segment: string;
  Sales_Rep_ID: string;
  Sales_Rep_Name: string;
  Manager_Name: string;
  Product_Category: string;
  Sub_Category: string;
  Product_Name: string;
  Product_SKU: string;
  Units_Sold: number;
  Unit_Price: number;
  "Discount_%": number;
  COGS: number;
  Revenue: number;
  Profit: number;
  "Profit_Margin_%": number;
  Payment_Mode: string;
  Delivery_Days: number;
  Return_Flag: number;
  Customer_Rating: number;
  Channel: string;
  Quarter: string;
  Month_Name: string;
  Year: number;
}

const regions = ["North", "South", "East", "West", "Central"];
const statesByRegion: Record<string, { state: string; city: string }[]> = {
  North: [{ state: "Delhi", city: "New Delhi" }, { state: "Punjab", city: "Ludhiana" }],
  South: [{ state: "Karnataka", city: "Bangalore" }, { state: "Tamil Nadu", city: "Chennai" }],
  East: [{ state: "West Bengal", city: "Kolkata" }, { state: "Odisha", city: "Bhubaneswar" }],
  West: [{ state: "Maharashtra", city: "Mumbai" }, { state: "Gujarat", city: "Ahmedabad" }],
  Central: [{ state: "Madhya Pradesh", city: "Indore" }, { state: "Chhattisgarh", city: "Raipur" }],
};

const segments = ["B2B", "B2C", "Enterprise"];
const channels = ["Online", "Offline", "Partner"];
const paymentModes = ["Credit Card", "Bank Transfer", "UPI", "Cash"];

const products = {
  Electronics: {
    Laptops: ["ProBook X1", "GamerZ 15", "UltraSlim 13"],
    Phones: ["X-Phone 12", "S-Galaxy 22", "V-Smart"],
  },
  Furniture: {
    Chairs: ["Ergo Deluxe", "Office Standard", "Exec Leather"],
    Desks: ["Standing Pro", "Corner L-Desk", "Wooden Classic"],
  },
  "Office Supplies": {
    Paper: ["A4 Ream Premium", "Legal Size Ream"],
    Binders: ["Ring Binder Set", "Archive Box Pack"],
  },
};

const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;

export function generateDataset(numRows = 500): SalesRecord[] {
  const data: SalesRecord[] = [];
  let orderCounter = 1000;

  for (let i = 0; i < numRows; i++) {
    orderCounter += randomInt(1, 5);
    const orderId = `ORD-${orderCounter}`;

    const startObj = new Date("2021-01-01").getTime();
    const endObj = new Date("2024-12-31").getTime();
    const dateObj = new Date(Math.random() * (endObj - startObj) + startObj);
    const dateStr = dateObj.toISOString().split("T")[0];
    const year = dateObj.getFullYear();
    const month = dateObj.toLocaleString("default", { month: "short" });
    const quarter = `Q${Math.floor(dateObj.getMonth() / 3) + 1}`;

    const region = randomElement(regions);
    const stateCity = randomElement(statesByRegion[region]);
    const segment = randomElement(segments);
    const channel = randomElement(channels);
    
    const category = randomElement(Object.keys(products)) as keyof typeof products;
    const subCategoryMapping = products[category] as Record<string, string[]>;
    const subCategory = randomElement(Object.keys(subCategoryMapping));
    const productName = randomElement(subCategoryMapping[subCategory]);
    const sku = `${category.substring(0, 3).toUpperCase()}-${subCategory.substring(0, 3).toUpperCase()}-${randomInt(100, 999)}`;

    const unitPrice = randomFloat(10, 1500);
    const unitsSold = segment === "Enterprise" ? randomInt(20, 200) : randomInt(1, 15);
    const discountPct = segment === "Enterprise" ? randomFloat(0.1, 0.3) : randomFloat(0, 0.2);
    
    const grossRevenue = unitPrice * unitsSold;
    const revenue = grossRevenue * (1 - discountPct);
    
    let margin = randomFloat(0.3, 0.6); 
    if (month === "Nov" || month === "Dec") {
      margin -= 0.1;
    }
    
    const cogs = unitPrice * unitsSold * (1 - margin);
    const profit = revenue - cogs;
    const profitMargin = (profit / revenue) * 100;

    const returnFlag = Math.random() > 0.92 ? 1 : 0;
    const deliveryDays = randomInt(1, channel === "Online" ? 5 : 14);
    const rating = Math.random() > 0.1 ? randomInt(3, 5) : randomInt(1, 2);

    data.push({
      Order_ID: orderId,
      Date: dateStr,
      Region: region,
      State: stateCity.state,
      City: stateCity.city,
      Customer_ID: `CUST-${randomInt(1000, 9000)}`,
      Customer_Name: `Customer ${randomInt(1, 500)}`,
      Customer_Segment: segment,
      Sales_Rep_ID: `REP-${randomInt(10, 50)}`,
      Sales_Rep_Name: `Rep Name ${randomInt(1, 40)}`,
      Manager_Name: `Manager ${randomInt(1, 5)}`,
      Product_Category: category,
      Sub_Category: subCategory,
      Product_Name: productName,
      Product_SKU: sku,
      Units_Sold: Math.round(unitsSold),
      Unit_Price: Number(unitPrice.toFixed(2)),
      "Discount_%": Number((discountPct * 100).toFixed(2)),
      COGS: Number(cogs.toFixed(2)),
      Revenue: Number(revenue.toFixed(2)),
      Profit: Number(profit.toFixed(2)),
      "Profit_Margin_%": Number(profitMargin.toFixed(2)),
      Payment_Mode: randomElement(paymentModes),
      Delivery_Days: deliveryDays,
      Return_Flag: returnFlag,
      Customer_Rating: rating,
      Channel: channel,
      Quarter: quarter,
      Month_Name: month,
      Year: year,
    });
  }

  return data.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
}

export function convertToCSV(data: SalesRecord[]): string {
  if (data.length === 0) return "";
  const header = Object.keys(data[0]).join(",");
  const rows = data.map(record => 
    Object.values(record).map(val => {
      if (typeof val === 'string' && val.includes(',')) {
        return `"${val}"`;
      }
      return val;
    }).join(",")
  );
  return [header, ...rows].join("\n");
}

function generate() {
    console.log("Generating synthetic data...");
    const data = generateDataset(500);
    const csv = convertToCSV(data);
    
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    
    fs.writeFileSync(path.join(dir, 'synthetic_sales_data.csv'), csv);
    console.log("synthetic_sales_data.csv generated in /data folder.");
}

generate();
