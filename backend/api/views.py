from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CodeTranslationSerializer


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

            try:
                # Preprocessing 
                promt = f'translate to {target_language}: {code}'
                inputs = tokenizer(promt, return_tensors="pt", max_length=512, truncation=True)

                # Generate translation
                outputs = model.generate(inputs["input_ids"], max_length=1024, num_beams=4, early_stopping=True)
                translated_code = tokenizer.decode(outputs[0], skip_special_tokens=True)

                return Response({"translated_code": translated_code}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
