import json
import torch

def load_data():
    with open("data/training_data.json", "r", encoding="utf-8") as f:
        return json.load(f)

def build_vocab(data):
    vocab = {"<PAD>": 0, "<UNK>": 1}
    for item in data:
        for word in item["input"].split():
            if word not in vocab:
                vocab[word] = len(vocab)
    return vocab

def text_to_tensor(text, vocab, max_len=10):
    words = text.split()
    indices = [vocab.get(word, 1) for word in words]
    indices = indices[:max_len] + [0] * (max_len - len(indices))
    return torch.tensor(indices, dtype=torch.long)

def save_vocab(vocab):
    with open("data/vocab.json", "w", encoding="utf-8") as f:
        json.dump(vocab, f)

def load_vocab():
    with open("data/vocab.json", "r", encoding="utf-8") as f:
        return json.load(f)