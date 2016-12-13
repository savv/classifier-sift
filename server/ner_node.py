# Load NER
from __future__ import unicode_literals
import spacy
import pathlib
from spacy.pipeline import EntityRecognizer
from spacy.vocab import Vocab
import json

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
    data = [json.loads(x['value'].decode()) for x in req['in']['data']]
    for datum in data:
        doc = nlp.make_doc(datum['text'])
        ner(doc)
        print('Found event times:', [x for x in doc if x.ent_type_ == 'Event_Time'])
    print('Got', len(req['in']['data']), 'values.')
