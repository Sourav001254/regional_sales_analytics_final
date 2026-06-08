import pandas as pd
import pandera as pa
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_validation():
    logger.info("Starting schema validation...")
    try:
        df = pd.read_csv("cleaned_sales_data.csv")
    except FileNotFoundError:
        logger.error("cleaned_sales_data.csv not found! Run data_cleaning.py first.")
        return

    schema = pa.DataFrameSchema({
        "Revenue":         pa.Column(float, pa.Check.ge(0)),
        "Units_Sold":      pa.Column(int,   pa.Check.ge(1)),
        "Discount_%":      pa.Column(float, pa.Check.in_range(0, 100)),
        "Profit_Margin_%": pa.Column(float, pa.Check.in_range(-100, 100)),
        "Region":          pa.Column(str,   pa.Check.isin(["North", "South", "East", "West", "Central"])),
        "Order_ID":        pa.Column(str,   unique=True),
    })

    try:
        validated_df = schema.validate(df)
        logger.info("Schema validation passed.")
    except pa.errors.SchemaError as e:
        logger.error(f"Schema validation failed: {e}")
        raise

if __name__ == "__main__":
    run_validation()
