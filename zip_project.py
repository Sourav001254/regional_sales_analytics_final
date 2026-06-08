import os
import zipfile

def zip_project(folder_path, output_path):
    print(f"Creating zip file at {output_path}...")
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder_path):
            # Exclude massive or unnecessary directories
            dirs[:] = [d for d in dirs if d not in ('node_modules', '.git', 'venv', '__pycache__', '.pytest_cache', 'dist')]
            for file in files:
                # Exclude the zip file itself and python cache
                if file.endswith('.zip') or file.endswith('.pyc'):
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, folder_path)
                zipf.write(file_path, arcname)
    print("Zip created successfully.")

if __name__ == "__main__":
    current_dir = os.path.abspath(".")
    zip_path = os.path.abspath("../regional_sales_analytics_final.zip")
    zip_project(current_dir, zip_path)
