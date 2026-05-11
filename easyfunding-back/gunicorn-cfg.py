# gunicorn-cfg.py
# -*- encoding: utf-8 -*-

bind = '0.0.0.0:8000'
workers = 2
threads = 2
timeout = 600  # 6 minuto para a maioria das requisições
graceful_timeout = 60
max_requests = 1000  # Reinicia worker após processar 1000 requisições
max_requests_jitter = 50  # Aleatoriedade para evitar todos os workers reiniciarem ao mesmo tempo
accesslog = '-'
loglevel = 'info'  # Use 'info' ou 'warning' para produção
capture_output = True
enable_stdio_inheritance = True
