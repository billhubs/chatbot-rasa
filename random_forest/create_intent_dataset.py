import yaml
import csv

def extract_intent_dataset(nlu_yml_path: str, output_csv_path: str):
    with open(nlu_yml_path, 'r', encoding='utf-8') as f:
        nlu_data = yaml.safe_load(f)

    with open(output_csv_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['text', 'intent'])

        for item in nlu_data.get('nlu', []):
            intent = item.get('intent')
            examples = item.get('examples', '')
            # Examples are in multiline string with '- ' prefix
            for line in examples.strip().split('\n'):
                line = line.strip()
                if line.startswith('- '):
                    text = line[2:].strip()
                    writer.writerow([text, intent])

if __name__ == "__main__":
    extract_intent_dataset('data/nlu.yml', 'random_forest/intent_dataset.csv')
