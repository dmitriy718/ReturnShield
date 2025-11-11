from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="has_completed_walkthrough",
            field=models.BooleanField(
                default=False,
                help_text="True once the guided dashboard walkthrough has been completed.",
            ),
        ),
        migrations.AddField(
            model_name="user",
            name="has_shopify_store",
            field=models.BooleanField(
                default=False,
                help_text="Indicates if the merchant operates an active Shopify storefront.",
            ),
        ),
        migrations.AddField(
            model_name="user",
            name="subscription_status",
            field=models.CharField(
                choices=[
                    ("trial", "Trial"),
                    ("launch", "Launch"),
                    ("scale", "Scale"),
                    ("elite", "Elite"),
                ],
                default="trial",
                help_text="Current paid subscription tier for gated feature access.",
                max_length=16,
            ),
        ),
    ]

