from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Portugal2030Notice, NoticeFavourite
from .serializers import Portugal2030NoticeSerializer, NoticeFavouriteToggleSerializer


class Portugal2030NoticeListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = Portugal2030NoticeSerializer

    def get_queryset(self):
        # Cada aviso pode ter múltiplos registos (um por atualização).
        # DISTINCT ON (code) garante que retorna apenas o mais recente de cada aviso.
        return (
            Portugal2030Notice.objects
            .order_by('code', '-notice_updated_at')
            .distinct('code')
        )


class NoticeFavouriteListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        codes = NoticeFavourite.objects.filter(user=request.user).values_list('notice_code', flat=True)
        return Response(list(codes))


class NoticeFavouriteToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = NoticeFavouriteToggleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        notice_code = serializer.validated_data['notice_code']
        favourite, created = NoticeFavourite.objects.get_or_create(
            user=request.user,
            notice_code=notice_code,
        )

        if not created:
            favourite.delete()
            return Response({'is_favourite': False})

        return Response({'is_favourite': True})


class Portugal2030NoticeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, code):
        # Busca todas as versões do aviso pelo code
        # Ordenação secundária por -created_at para desempatar registos com o mesmo notice_updated_at
        versions = Portugal2030Notice.objects.filter(code=code).order_by('-notice_updated_at', '-created_at')

        if not versions.exists():
            return Response({'detail': 'Aviso não encontrado.'}, status=404)

        # A versão mais recente é o topo da lista
        latest = Portugal2030NoticeSerializer(versions.first()).data
        # Histórico completo de atualizações
        history = Portugal2030NoticeSerializer(versions, many=True).data

        return Response({
            'latest': latest,
            'history': history,
        })
