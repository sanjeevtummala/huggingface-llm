import logging
import torch
from django.shortcuts import render, redirect
from django.http import JsonResponse
from transformers import AutoTokenizer, BloomForCausalLM

tokenizer = AutoTokenizer.from_pretrained("bigscience/bloom-3b")
model = BloomForCausalLM.from_pretrained("bigscience/bloom-3b", device_map="auto") 

logger = logging.getLogger(__name__)

def chatbot_view(request):
    if request.method == 'POST':
        user_input = request.POST.get('user_input')
        logger.info(f"User input received: {user_input}")

        # Tokenize and generate
        input_ids = tokenizer(user_input, return_tensors="pt").input_ids.to("cuda")
        output = model.generate(input_ids, max_length=100)
        bot_response = tokenizer.decode(output[0], skip_special_tokens=True)
        logger.info(f"Bot response generated: {bot_response}")

        return JsonResponse({'bot_response': bot_response})

    return render(request, 'chatbot/chat_template.html')
