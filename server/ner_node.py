# Load NER
from __future__ import unicode_literals
import spacy
import pathlib
from spacy.pipeline import EntityRecognizer
from spacy.vocab import Vocab

def load_model(model_dir):
    model_dir = pathlib.Path(model_dir)
    nlp = spacy.load('en', parser=False, entity=False, add_vectors=False)
    with (model_dir / 'vocab' / 'strings.json').open('r', encoding='utf8') as file_:
        nlp.vocab.strings.load(file_)
    nlp.vocab.load_lexemes(model_dir / 'vocab' / 'lexemes.bin')
    ner = EntityRecognizer.load(model_dir, nlp.vocab, require=True)
    return (nlp, ner)

(nlp, ner) = load_model('server/ner')

def compute(req):
    data = [json.loads(x['value'] for x in req['in']['data'])]
    print('NER Node got', len(data), 'values.')
    for datum in data:
        text = 'SUBJECT: ' + datum.get('subject', '') + '\n'
        text += datum.get('textBody', '') or datum.get('strippedHtmlBody', '')
        doc = nlp.make_doc(text)
        ner(doc)
        print([(x, x.ent_type_) for x in doc])
