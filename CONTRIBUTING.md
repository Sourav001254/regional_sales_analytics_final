# Contributing to Regional Sales Performance Analytics

First off, thank you for considering contributing to this project!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/regional-sales-performance-analytics.git
   cd regional-sales-performance-analytics
   ```

2. **Environment Configuration**
   - We highly recommend using a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
   - Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   - Add your `.env` file (copy `.env.example` if applicable) for API access (e.g., Gemini).

3. **Running the Pipeline**
   - Run the initial data generation via Node (if modifying `dataGenerator.ts`) or use the provided CSV.
   - Run the Python processing pipeline:
   ```bash
   python data_cleaning.py
   python validate_schema.py
   python eda_analysis.py
   python advanced_features.py
   python pro_analytics.py
   ```

4. **Testing & Code Quality**
   Before submitting a pull request, ensure tests and linting pass:
   ```bash
   flake8 *.py
   pytest test_data_pipeline.py --cov=.
   ```

## Pull Request Process

1. Create your feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request ensuring the CI pipeline checks (GitHub Actions) pass.
