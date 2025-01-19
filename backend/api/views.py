from transformers import AutoTokenizer, RobertaTokenizer, AutoModelForSeq2SeqLM, T5ForConditionalGeneration
from peft import PeftModel, PeftConfig
import os
import torch

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from transformers import TextIteratorStreamer
from django.http import StreamingHttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CodeTranslationSerializer
import os
import threading



model_path = os.path.join("api", "early_stopping_lora_4bit_quant_codeT5-small-own-dataV4_100_epochs_batchsize_8")

peft_model_id = model_path

config = PeftConfig.from_pretrained(peft_model_id)

model = T5ForConditionalGeneration.from_pretrained(
    config.base_model_name_or_path,
    device_map="cpu",
)

tokenizer = RobertaTokenizer.from_pretrained(config.base_model_name_or_path)

model = PeftModel.from_pretrained(model, peft_model_id)
model = model.merge_and_unload() 

class CodeTranslationView(APIView):
    def post(self, request):
        serializer = CodeTranslationSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data["code"]
            target_language = serializer.validated_data["target_language"]

            def generate_stream():

                streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)

                try:
                    # Preprocessing 
                    promt = f'translate to {target_language}: {code}'
                    inputs = tokenizer(promt, return_tensors="pt", max_length=2048, truncation=True)

                    # Start the generation in a separate thread
                    generation_kwargs = dict(inputs, streamer=streamer, max_new_tokens=1024)
                    generation_thread = threading.Thread(target=model.generate, kwargs=generation_kwargs)
                    generation_thread.start()
                
                     # Stream the generated text
                    for new_text in streamer:
                        yield new_text
                        
                except Exception as e:
                    return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return StreamingHttpResponse(generate_stream(), content_type="text/event-stream")

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
