# Kabul - Code Translation

Web Application for translating code from one language (e.g Java) to another language (e.g. Python).

## Description

### Project Overview
This project aims to fine-tune existing models using the Hugging Face library for code translation tasks. The goal is to evaluate different models and datasets, adjusting hyperparameters to find the best-performing combination. The trained models, data, and results are stored in the model_training directory, which also includes an Excel file for model comparison. Additionally, a detailed research paper explaining the methodology and findings is included.

In-depth paragraph about our project and overview of use. 

### Project structure
#TODO: complete project structure
```Bash
\project-root
|
├──  /backend                   # Django backend code
|    ├── ...    
|    └── ...
|
├── /frontend                   # React frontend code
|    ├── ...    
|    └── ...
|
├── /model_training             # Trained models, data, and results
|    ├── ...    
|    └── ...
|  
├── /docs  
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
    
    TODO: Figure out what dependencies must be installed if new user clones project

1. **Build and start the containers using Docker Compose**
    ```bash
    docker-compose up --profiles dev up
    ```
    This command will build and start both the React frontend and Django backend containers. It will also configure networking between the two services.

2. **Access the Application**
    
    Frontend (React): Open your browser and go to http://localhost:3000


## Model Fine-Tuning & Benchmarking

This project uses Hugging Face's transformers library to fine-tune pre-trained models for code translation tasks. The goal is to benchmark various models with different hyperparameters and datasets to identify the most optimal configuration.

TODO: Explain fine tuning process

### Training

### Fine-Tuned Models

### Datasets

## Research Paper
A detailed paper explaining the methodology, model evaluation, and results is included in the /docs/project_paper.pdf file. This paper provides insights into the benchmarking process, model selection, and potential areas for future improvements.

## Troubleshooting: 
- when you run into issues like react-script not found try to run npm install in the /frontend folder from terminal first and the try the docker run command again 