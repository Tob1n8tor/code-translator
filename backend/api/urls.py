from django.urls import path
from .views import CodeTranslationView

urlpatterns = [
    path('translate-code/', CodeTranslationView.as_view(), name='translate_code'),
]