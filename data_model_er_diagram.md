# Data Model & ER Diagram (Star Schema)

When an interviewer asks: *"Explain your data model for this project,"* you can confidently describe this highly optimized Star Schema design.

```ascii
                      ┌──────────────────────┐
                      │    DIM_CUSTOMER      │
                      │----------------------│
                      │PK: Customer_ID       │
                      │    Customer_Name     │
                      │    Customer_Segment  │
                      └──────────┬───────────┘
                                 │ (1)
                                 │
                                 │ (∞)
┌──────────────┐      ┌──────────────────────┐      ┌───────────────┐
│   DIM_DATE   │ (1)  │     FACT_SALES       │  (1) │  DIM_PRODUCT  │
│--------------│      │----------------------│      │---------------│
│PK: Date      ├──────┤FK: Date              ├──────┤PK: Product_SKU│
│    Year      │  (∞) │FK: Customer_ID       │  (∞) │    Category   │
│    Quarter   │      │FK: Product_SKU       │      │    Sub_Cat    │
│    Month_Name│      │FK: Geo_ID            │      │    Prod_Name  │
│    Day       │      │FK: Sales_Rep_ID      │      └───────────────┘
└──────────────┘      │    Units_Sold        │
                      │    Unit_Price        │
┌──────────────┐      │    Discount_%        │      ┌───────────────┐
│  DIM_REGION  │ (1)  │    COGS              │  (1) │ DIM_SALES_REP │
│--------------│      │    Revenue           │      │---------------│
│PK: Geo_ID    ├──────┤    Profit            ├──────┤PK: Sales_Rep_ID│
│    Region    │  (∞) └──────────┬───────────┘  (∞) │    Name       │
│    State     │                 │                  │    Manager    │
│    City      │                 │                  │    Region     │
└──────────────┘                 V                  └───────────────┘
                         [ Derived Metrics ]
                         Profit Margin %, Return Rate
                         Sales Velocity, YoY Growth
```

## Why a Star Schema?
1. **Performance:** Power BI's VertiPaq engine compresses data exponentially better when utilizing a Star Schema. Fact tables are built of narrow integer keys, reducing memory footprint.
2. **Filter Propagation:** One-to-many relationships allow filter context to flow smoothly from Dimensions (like clicking "North Region" in Dim_Region) seamlessly filtering the Fact_Sales table.
3. **DAX Simplicity:** Measures calculate securely without encountering ambiguous cross-filtering or many-to-many relationship hazards associated with flat tables ("snowflake" or single-table schemas).
