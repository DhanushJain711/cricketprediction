class CricketPredictor {
    constructor() {
        this.form = document.getElementById('predictionForm');
        this.predictBtn = document.getElementById('predictBtn');
        this.btnText = document.querySelector('.btn-text');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.resultContainer = document.getElementById('resultContainer');
        this.predictedScore = document.getElementById('predictedScore');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');

        this.apiEndpoint = 'http://localhost:8000/predict-score'; // Update with your FastAPI endpoint

        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.addInputValidation();
    }

    addInputValidation() {
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.clearErrors();
                this.validateInput(input);
            });
        });
    }

    validateInput(input) {
        const value = parseFloat(input.value);
        let isValid = true;

        switch (input.name) {
            case 'ball':
                if (value < 0.1 || value > 19.6) {
                    isValid = false;
                    this.showFieldError(input, 'Ball must be between 0.1 and 19.6');
                }
                break;
            case 'wickets':
                if (value < 0 || value > 10) {
                    isValid = false;
                    this.showFieldError(input, 'Wickets must be between 0 and 10');
                }
                break;
            case 'runs':
            case 'striker_score':
            case 'striker_balls':
            case 'non_striker_runs':
            case 'non_striker_balls':
                if (value < 0) {
                    isValid = false;
                    this.showFieldError(input, 'Value must be positive');
                }
                break;
        }

        if (isValid) {
            input.style.borderColor = '#e1e5e9';
        }
    }

    showFieldError(input, message) {
        input.style.borderColor = '#dc2626';
        input.title = message;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        this.setLoadingState(true);
        this.clearErrors();

        try {
            const formData = this.getFormData();
            const prediction = await this.makePrediction(formData);
            this.displayResult(prediction.predicted_score);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoadingState(false);
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            }
        });

        return isValid;
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};

        for (const [key, value] of formData.entries()) {
            data[key] = parseFloat(value);
        }

        return data;
    }

    async makePrediction(data) {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('API endpoint not found. Make sure the FastAPI server is running on http://localhost:8000');
            } else if (response.status === 422) {
                const errorData = await response.json();
                const errorMessages = errorData.detail?.map(err => err.msg).join(', ') || 'Invalid input data';
                throw new Error(`Validation error: ${errorMessages}`);
            } else {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
        }

        return await response.json();
    }

    setLoadingState(isLoading) {
        this.predictBtn.disabled = isLoading;

        if (isLoading) {
            this.btnText.textContent = 'Predicting...';
            this.loadingSpinner.style.display = 'block';
        } else {
            this.btnText.textContent = 'Predict Final Score';
            this.loadingSpinner.style.display = 'none';
        }
    }

    displayResult(score) {
        this.predictedScore.textContent = Math.round(score);
        this.resultContainer.classList.add('show');

        // Smooth scroll to result
        setTimeout(() => {
            this.resultContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
    }

    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.classList.add('show');

        // Auto-hide error after 8 seconds
        setTimeout(() => {
            this.clearErrors();
        }, 8000);
    }

    clearErrors() {
        this.errorMessage.classList.remove('show');
        this.resultContainer.classList.remove('show');

        // Clear field-specific errors
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.borderColor = '#e1e5e9';
            input.title = '';
        });
    }
}

// Enhanced form interactions
document.addEventListener('DOMContentLoaded', () => {
    new CricketPredictor();

    // Add sample data button for testing
    const main = document.querySelector('.main');
    const sampleDataBtn = document.createElement('button');
    sampleDataBtn.type = 'button';
    sampleDataBtn.className = 'sample-data-btn';
    sampleDataBtn.textContent = 'Load Sample Data';
    sampleDataBtn.style.cssText = `
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        color: #374151;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 0.875rem;
        cursor: pointer;
        margin-bottom: 20px;
        transition: all 0.2s ease;
    `;

    sampleDataBtn.addEventListener('mouseenter', () => {
        sampleDataBtn.style.backgroundColor = '#e5e7eb';
    });

    sampleDataBtn.addEventListener('mouseleave', () => {
        sampleDataBtn.style.backgroundColor = '#f3f4f6';
    });

    sampleDataBtn.addEventListener('click', () => {
        // Sample match state: 15th over, 3rd ball
        document.getElementById('ball').value = '15.3';
        document.getElementById('runs').value = '142';
        document.getElementById('wickets').value = '3';
        document.getElementById('striker_score').value = '45';
        document.getElementById('striker_balls').value = '32';
        document.getElementById('non_striker_runs').value = '28';
        document.getElementById('non_striker_balls').value = '21';
    });

    main.insertBefore(sampleDataBtn, main.querySelector('.prediction-form'));

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    document.getElementById('predictBtn').click();
                    break;
                case 'r':
                    e.preventDefault();
                    document.getElementById('predictionForm').reset();
                    document.querySelector('.result-container').classList.remove('show');
                    break;
            }
        }
    });
});
