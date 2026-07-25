import torch
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.model import PropertyRNN
from src.preprocess import load_data, load_vocab, text_to_tensor

data = load_data()
vocab = load_vocab()

vocab_size = len(vocab)
output_size = len(data)

model = PropertyRNN(vocab_size, 16, 32, output_size)
model.load_state_dict(torch.load("models/property_model.pth"))
model.eval()

conversation_history = []

def predict(text):
    with torch.no_grad():
        input_tensor = text_to_tensor(text, vocab).unsqueeze(0)
        output, _ = model(input_tensor)
        predicted = torch.argmax(output).item()
        return data[predicted]["output"]

def predict_with_memory(text):
    conversation_history.append(text)
    context = " ".join(conversation_history[-3:])
    with torch.no_grad():
        input_tensor = text_to_tensor(context, vocab).unsqueeze(0)
        output, _ = model(input_tensor)
        predicted = torch.argmax(output).item()
        response = data[predicted]["output"]
    conversation_history.append(response)
    return response

def predict_with_suggestions(text):
    conversation_history.append(text)
    context = " ".join(conversation_history[-3:])
    with torch.no_grad():
        input_tensor = text_to_tensor(context, vocab).unsqueeze(0)
        output, _ = model(input_tensor)
        top3 = torch.topk(output, 3).indices[0].tolist()
        main_response = data[top3[0]]["output"]
        suggestions = [data[i]["output"] for i in top3[1:]]
    conversation_history.append(main_response)
    return {
        "response": main_response,
        "suggestions": suggestions
    }

if __name__ == "__main__":
    result = predict_with_suggestions("lahore mein flat chahiye")
    print("Response:", result["response"])
    print("Suggestions:", result["suggestions"])