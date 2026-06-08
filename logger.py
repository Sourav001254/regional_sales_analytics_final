import logging
import os

# Ensure logs directory exists if needed, but the user requested pipeline.log in current dir
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler("pipeline.log"), 
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("pipeline_logger")
