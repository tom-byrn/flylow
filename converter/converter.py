import csv
import json

# Function to convert CSV to JSON
def csv_to_json(csv_filepath, json_filepath):
    data = []
    # Read the CSV file and convert each row into a dictionary
    with open(csv_filepath, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            data.append(row)
    
    # Write the list of dictionaries to a JSON file
    with open(json_filepath, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)

# Example usage
csv_filepath = './converter/airports.csv'  # Replace with your CSV file path
json_filepath = './converter/airports.json'  # Replace with your desired JSON file path
csv_to_json(csv_filepath, json_filepath)