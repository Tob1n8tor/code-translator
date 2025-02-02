# Kabul - Code Translation

Web Application for translating code from one language (e.g Java) to another language (e.g. Python).

## Description

### Project Overview
This project aims to fine-tune existing models using the Hugging Face library for code translation tasks. The goal is to evaluate different models and datasets, adjusting hyperparameters to find the best-performing combination. The trained models, data, and results are stored in the model_training directory, which also includes an Excel file for model comparison. Additionally, a detailed research paper explaining the methodology and findings is included.

In-depth paragraph about our project and overview of use. 

### Project structure
#TODO: complete project structure
```Bash
\kabul
|
├──  /backend                   # Django backend code
|    ├── /api                   # Django REST API and used model for translation           
|    ├── /backend               # Django project settings  
|    ├── Dockerfile             # Dockerfile for Django backend
|    ├── manage.py              # Django project entry point
|    └── requirements.txt       # Python dependencies
|
├── /frontend                   # React frontend code
|    ├── /node_modules          # Node.js dependencies      
|    ├── /public                # Public assets
|    ├── /src                   # React components including App.js and App.css for the UI
|    └── Dockerfile             # Dockerfile for React frontend
|
├── /model_training             # Trained models, data, and results
|    ├── /benchmarking          # Model benchmarking results and code used for evaluation    
|    └── /training_codes        # Python notebooks for model training
|  
├── /docs                       # Folder including final project paper
|    └── project.paper.tex
|    └── project.paper.pdf 
|    
├── docker-compose.yml          # Docker Compose configuration for local setup
└── README.md                   # This README file
```

## Getting started

### Prerequisites
- Docker Desktop installed on your machine.
  - Installation guide: https://www.docker.com/products/docker-desktop/ 
- Docker Compose installed (comes with Docker Desktop).

### Installation Steps
1. **Clone the repository**
    ```bash
    git clone https://gitlab.lrz.de/bpc-ws-2425/kabul.git
    cd kabul
    ```
2. **Install dependencies**
    ```bash
    cd frontend
    npm install
    cd ..
    ```

1. **Build and start the containers using Docker Compose**
    ```bash
    docker-compose --profile dev up
    ```
    This command will build and start both the React frontend and Django backend containers. It will also configure networking between the two services.

2. **Access the Application**
    
    Frontend (React): Open your browser and go to http://localhost:3000

### Online Access
Our application is currently deployed online and can be accessed directly without requiring local setup.
Visit the following link to explore the code translation functionality: https://code-translation.com

## Model Fine-Tuning & Benchmarking

This project uses Hugging Face's transformers library to fine-tune pre-trained models for code translation tasks. The goal is to benchmark various models with different hyperparameters and datasets to identify the most optimal configuration.

### Training
The model training code is included in the model_training/training_codes directory. The training process involves loading the pre-trained model, preparing and tokenizing the training data, and fine-tuning the model on the target dataset. The training code is written in Python and uses the Hugging Face transformers library.

### Fine-Tuned Models
We fine tuned following base models for code translation tasks:
- Salesforce/codeT5-small
- Salesforce/codeT5-base
- openai-community/gpt2
- microsoft/codebert-base
- NousResearch/Llama-3.2-1B
- facebook/bart-base
- lirezamsh/small100

### Datasets
For the model fine-tuning process, we use the following datasets:
- https://huggingface.co/datasets/NTU-NLP-sg/xCodeEval
- https://huggingface.co/datasets/ziwenyd/transcoder-geeksforgeeks
- https://huggingface.co/datasets/CM/codexglue_codetrans
- a balanced custom dataset created by combining webscraped data from LeetCode answers with the transcoder-geeksforgeeks dataset  
- a unbalanced custom dataset by combining the transcoder-geeksforgeeks dataset with the xCodeEval dataset, the codexglue_codetrans dataset as well as some instances generated by ChatGPT (combinded_dataset.csv)

The custom datasets are stored in the model_training/training_codes/data directory.

### Benchmarking
For benchmarking, we evaluate the performance of different fine tuned models using the rouge score, TER score, BERTScore and Frugal score. The benchmarking results are stored in the form of an Excel file inside the model_training/benchmarking directory. 
We benchmarked the models using different test sets. We had one test set for each translation task (e.g. Java to Python, Python to Java, etc.) as well as a combined test set that included all translation tasks.
For easier comparison, the results are also visualized using differnts charts in the Excel file.
The benchmarking code is included in the model_training/benchmarking directory. For more details on the benchmarking process, refer to the research paper included in the /docs directory.

## Research Paper
A detailed paper explaining the methodology, model evaluation, and results is included in the /docs/project_paper.pdf file. This paper provides insights into the benchmarking process, model selection, and potential areas for future improvements.

## Troubleshooting: 
- when you run into issues like react-script not found try to run npm install in the /frontend folder from terminal first and the try the docker run command again 