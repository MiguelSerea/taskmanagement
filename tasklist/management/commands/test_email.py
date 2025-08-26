from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from decouple import config

class Command(BaseCommand):
    help = 'Testa o envio de email'

    def add_arguments(self, parser):
        parser.add_argument(
            '--to',
            type=str,
            default=config('EMAIL_HOST_USER'),
            help='Email de destino para o teste'
        )

    def handle(self, *args, **options):
        to_email = options['to']
        
        self.stdout.write('🔄 Testando configuração de email...')
        self.stdout.write(f'📧 De: {settings.EMAIL_HOST_USER}')
        self.stdout.write(f'📧 Para: {to_email}')
        
        try:
            send_mail(
                subject='✅ Teste de Email - TaskManagement',
                message='''Este é um teste de configuração de email do TaskManagement.

Se você recebeu este email, a configuração está funcionando corretamente!

Configurações testadas:
- SMTP Gmail
- Autenticação por token
- Variáveis de ambiente

Atenciosamente,
Sistema TaskManagement''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[to_email],
                fail_silently=False,
            )
            self.stdout.write(
                self.style.SUCCESS('✅ Email enviado com sucesso!')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Erro ao enviar email: {e}')
            )
            self.stdout.write(
                self.style.WARNING('💡 Verifique:')
            )
            self.stdout.write('   - Se a senha de aplicativo está correta')
            self.stdout.write('   - Se a verificação em duas etapas está ativa')
            self.stdout.write('   - Se as variáveis de ambiente estão corretas')
            self.stdout.write('   - Se o arquivo .env está na raiz do projeto')