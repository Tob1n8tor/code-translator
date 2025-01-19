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


tokenizer = AutoTokenizer.from_pretrained("Salesforce/codet5-small")

#model = AutoModelForSeq2SeqLM.from_pretrained("Salesforce/codet5-small")
import os

model_path = os.path.join("api", "code_translation_model_seq2seq")
model = AutoModelForSeq2SeqLM.from_pretrained(model_path)

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
