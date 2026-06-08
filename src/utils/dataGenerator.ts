/**
 * Data Generator for Synthetic Sales Data
 * Generates highly realistic sales data for 2021-2024.
 */

export interface SalesRecord {
  Order_ID: string;
  Date: string;
  Region: string;
  State: string;
  City: string;
  Customer_ID: string;
  Customer_Name: string;
  Customer_Segment: string | null;
  Sales_Rep_ID: string;
  Sales_Rep_Name: string;
  Manager_Name: string;
  Product_Category: string;
  Sub_Category: string;
  Product_Name: string;
  Product_SKU: string;
  Units_Sold: number;
  Unit_Price: number | string;
  "Discount_%": number;
  COGS: number;
  Revenue: number;
  Profit: number;
  "Profit_Margin_%": number;
  Payment_Mode: string;
  Delivery_Days: number | null;
  Return_Flag: number | null;
  Customer_Rating: number;
  Channel: string | null;
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

export function generateDataset(numRows = 5000): SalesRecord[] {
  let data: SalesRecord[] = [];
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

    let unitPrice = randomFloat(10, 1500);
    const unitsSold = segment === "Enterprise" ? randomInt(20, 200) : randomInt(1, 15);
    const discountPct = segment === "Enterprise" ? randomFloat(0.1, 0.3) : randomFloat(0, 0.2);
    
    const grossRevenue = unitPrice * unitsSold;
    let revenue = grossRevenue * (1 - discountPct);
    
    let margin = randomFloat(0.3, 0.6); 
    if (month === "Nov" || month === "Dec") {
      margin -= 0.1;
    }
    
    let cogs = unitPrice * unitsSold * (1 - margin);
    let profit = revenue - cogs;
    let profitMargin = (profit / revenue) * 100;

    let returnFlag: number | null = Math.random() > 0.92 ? 1 : 0;
    let deliveryDays: number | null = randomInt(1, channel === "Online" ? 5 : 14);
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

  // 1. Inject duplicate Order_IDs with slightly different amounts (~1.5%)
  const numDuplicates = Math.floor(numRows * 0.015);
  for (let i = 0; i < numDuplicates; i++) {
    const targetIdx = randomInt(0, data.length - 1);
    const dupRow = { ...data[targetIdx] };
    if (typeof dupRow.Unit_Price === "number") {
      dupRow.Unit_Price = Number((dupRow.Unit_Price * randomFloat(0.95, 1.05)).toFixed(2));
    }
    dupRow.Revenue = Number((dupRow.Revenue * randomFloat(0.95, 1.05)).toFixed(2));
    dupRow.Profit = Number((dupRow.Revenue - dupRow.COGS).toFixed(2));
    data.push(dupRow);
  }

  // Sort by date before applying string messiness that breaks standard date sorting
  data = data.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

  // 2. Realistic returns: ~2% rows where Revenue is negative, COGS is negative, Return_Flag = 1
  data.forEach(row => {
    if (Math.random() < 0.02) {
      row.Revenue = -Math.abs(row.Revenue);
      row.COGS = -Math.abs(row.COGS);
      row.Profit = row.Revenue - row.COGS;
      row.Return_Flag = 1;
    }
  });

  // 3. Inject ~3% nulls scattered across specific columns
  data.forEach(row => {
    if (Math.random() < 0.03) row.Customer_Segment = null;
    if (Math.random() < 0.03) row.Channel = null;
    if (Math.random() < 0.03) row.Delivery_Days = null;
    if (Math.random() < 0.03) row.Return_Flag = null;
  });

  // 4. Inject ~0.5% negative COGS (system errors)
  data.forEach(row => {
    if (Math.random() < 0.005) {
      row.COGS = -Math.abs(row.COGS);
    }
  });

  // 5. Mixed date formats in 2% of rows (e.g. "Jan 15, 2022")
  data.forEach(row => {
    if (Math.random() < 0.02) {
      const d = new Date(row.Date);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      row.Date = `${months[d.getMonth()]} ${d.getDate().toString().padStart(2, '0')}, ${d.getFullYear()}`;
    }
  });

  // 6. Inject currency-symbol prices (~2%)
  data.forEach(row => {
    if (Math.random() < 0.02) {
      if (typeof row.Unit_Price === "number") {
        row.Unit_Price = `$${row.Unit_Price.toFixed(2)}`;
      }
    }
  });

  return data;
}

export function convertToCSV(data: SalesRecord[]): string {
  if (data.length === 0) return "";
  const header = Object.keys(data[0]).join(",");
  const rows = data.map(record => 
    Object.values(record).map(val => {
      if (val === null || val === undefined) return "";
      if (typeof val === 'string' && val.includes(',')) {
        return `"${val}"`;
      }
      return val;
    }).join(",")
  );
  return [header, ...rows].join("\n");
}
