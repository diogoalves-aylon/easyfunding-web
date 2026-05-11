from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from django.db.models.functions import TruncHour
from django.utils import timezone
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from api.auditlog.models import AuditLog
from api.notifications.models import Notification
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


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        User = get_user_model()
        now = timezone.now()

        # Latest version of each notice (PostgreSQL DISTINCT ON code)
        latest_ids = (
            Portugal2030Notice.objects
            .order_by('code', '-notice_updated_at')
            .distinct('code')
            .values_list('id', flat=True)
        )

        open_qs = Portugal2030Notice.objects.filter(
            id__in=latest_ids,
            type='Aberto',
            notice_end_date__gte=now,
        )

        avisos_abertos = open_qs.count()

        total_alloc = open_qs.aggregate(s=Sum('total_allocation'))['s'] or 0
        fundos_disponiveis = round(float(total_alloc) / 1_000_000)

        end_dates = list(open_qs.values_list('notice_end_date', flat=True))
        if end_dates:
            prazo_medio = round(sum(max(0, (d - now).days) for d in end_dates) / len(end_dates))
        else:
            prazo_medio = 0

        utilizadores_ativos = User.objects.filter(is_active=True).count()
        total_favoritos = NoticeFavourite.objects.count()

        # Last 24h activity bucketed by hour
        current_hour = now.replace(minute=0, second=0, microsecond=0)
        since = current_hour - timedelta(hours=23)

        audit_by_hour = {
            row['hour']: row['count']
            for row in AuditLog.objects
                .filter(created_at__gte=since)
                .annotate(hour=TruncHour('created_at'))
                .values('hour')
                .annotate(count=Count('id'))
        }
        notif_by_hour = {
            row['hour']: row['count']
            for row in Notification.objects
                .filter(created_at__gte=since)
                .annotate(hour=TruncHour('created_at'))
                .values('hour')
                .annotate(count=Count('id'))
        }

        history = [
            {
                'label': (since + timedelta(hours=i)).strftime('%H:%M'),
                'a': audit_by_hour.get(since + timedelta(hours=i), 0),
                'b': notif_by_hour.get(since + timedelta(hours=i), 0),
            }
            for i in range(24)
        ]

        return Response({
            'kpis': {
                'avisosAbertos': avisos_abertos,
                'utilizadoresAtivos': utilizadores_ativos,
                'fundosDisponiveis': fundos_disponiveis,
                'prazoMedio': prazo_medio,
                'totalFavoritos': total_favoritos,
            },
            'status': {
                'uptime': '99.9%',
                'incidents': '0',
                'healthScore': 99.5,
            },
            'history': history,
        })


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
