import requests
import sys
import json
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

def get_database():
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise Exception("MONGO_URI not found in .env file")
    
    client = MongoClient(mongo_uri)
    return client["job_database"]

def get_adzuna_jobs(api_id, api_key, query, location, results_per_page=10):
    url = "https://api.adzuna.com/v1/api/jobs/in/search/1"
    params = {
        "app_id": api_id,
        "app_key": api_key,
        "what": query,
        "where": location,
        "results_per_page": results_per_page,
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json().get("results", [])
    return []

def get_jsearch_jobs(api_key, query, location, results_per_page=5):
    url = "https://jsearch.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    }
    params = {
        "query": query,
        "location": location,
        "num_pages": results_per_page,
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json().get("data", [])
    return []

def transform_jobs(jobs, source):
    transformed_jobs = []
    for job in jobs:
        transformed_jobs.append({
            "title": job.get("title"),
            "company": job.get("company", {}).get("display_name") if source == "adzuna" else job.get("employer_name"),
            "location": job.get("location", {}).get("display_name") if source == "adzuna" else job.get("job_city"),
            "salary_min": job.get("salary_min"),
            "salary_max": job.get("salary_max"),
            "description": job.get("description") if source == "adzuna" else job.get("job_description"),
            "url": job.get("redirect_url") if source == "adzuna" else job.get("job_apply_link"),
            "source": source,
        })
    return transformed_jobs

if __name__ == "__main__":
    try:
        adzuna_api_id = "8191e188"
        adzuna_api_key = "59ddc434ecafecf313a0e03dcdaab07b"
        jsearch_api_key = "96afaae32cmsh370ec095eb80ba7p1bacc6jsn738a63f86743"

        job_title = sys.argv[1] if len(sys.argv) > 1 else "developer"
        location = sys.argv[2] if len(sys.argv) > 2 else "India"

        adzuna_jobs = get_adzuna_jobs(adzuna_api_id, adzuna_api_key, job_title, location)
        jsearch_jobs = get_jsearch_jobs(jsearch_api_key, job_title, location)

        transformed_adzuna = transform_jobs(adzuna_jobs, "adzuna")
        transformed_jsearch = transform_jobs(jsearch_jobs, "jsearch")

        all_jobs = transformed_adzuna + transformed_jsearch
        print(json.dumps(all_jobs))
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
