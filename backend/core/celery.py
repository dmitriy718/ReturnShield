"""
Celery configuration for ReturnShield.
"""
import os

from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('returnshield')

# Load config from Django settings with CELERY_ prefix
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks from all installed apps
app.autodiscover_tasks()

# Periodic tasks schedule
app.conf.beat_schedule = {
    'sync-all-shopify-stores-every-15-min': {
        'task': 'shopify_integration.tasks.sync_all_installations',
        'schedule': crontab(minute='*/15'),  # Every 15 minutes
    },
}

app.conf.timezone = 'UTC'


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    """Debug task for testing Celery is working."""
    print(f'Request: {self.request!r}')
