import subprocess
import time
import sys
import os

# Ensure we're running from the correct directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

steps = [
    ("Data Cleaning",     ["python", "data_cleaning.py"]),
    ("EDA Analysis",      ["python", "eda_analysis.py"]),
    ("Advanced Features", ["python", "advanced_features.py"]),
    ("Generate PDF",      ["python", "generate_pdf.py"]),
    ("Generate PPTX",     ["python", "generate_pptx.py"]),
]

def main():
    print("Starting Data Analytics Pipeline...")
    
    for name, cmd in steps:
        print(f"\n{'='*50}\nRunning: {name}\n{'='*50}")
        t = time.time()
        
        # Run the command
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        # We output standard out directly so we can see the logs if we want, 
        # or we rely on pipeline.log
        if result.stdout:
            print(result.stdout)
            
        if result.returncode != 0:
            print(f"[FAILED] {name}\n{result.stderr}")
            sys.exit(1)
            
        print(f"[DONE] {name} — {time.time()-t:.1f}s")

    print("\n[v] Full pipeline completed successfully.")

if __name__ == "__main__":
    main()
