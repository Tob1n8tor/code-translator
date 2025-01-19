from rest_framework import serializers

class CodeTranslationSerializer(serializers.Serializer):
   code = serializers.CharField()
   target_language = serializers.ChoiceField(choices=["python", "java", "c++"])