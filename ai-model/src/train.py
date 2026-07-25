import torch
import torch.nn as nn
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.model import PropertyRNN
from src.preprocess import load_data, build_vocab, text_to_tensor, save_vocab

data = load_data()
vocab = build_vocab(data)
save_vocab(vocab)

vocab_size = len(vocab)
output_size = len(data)

model = PropertyRNN(vocab_size, 16, 32, output_size)
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
criterion = nn.CrossEntropyLoss()

print("Training shuru ho raha hai...")

for epoch in range(200):
    total_loss = 0
    for i, item in enumerate(data):
        input_tensor = text_to_tensor(item["input"], vocab).unsqueeze(0)
        label = torch.tensor([item["label"]])

        optimizer.zero_grad()
        output, _ = model(input_tensor)
        loss = criterion(output, label)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    if (epoch + 1) % 20 == 0:
        print(f"Epoch {epoch+1}/200 - Loss: {total_loss:.4f}")

torch.save(model.state_dict(), "models/property_model.pth")
print("Model save ho gaya - models/property_model.pth")