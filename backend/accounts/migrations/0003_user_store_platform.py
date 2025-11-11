from django.db import migrations, models


def populate_store_platform(apps, schema_editor):
    User = apps.get_model("accounts", "User")
    for user in User.objects.all():
        if getattr(user, "has_shopify_store", False) and user.shopify_domain:
            user.store_platform = "shopify"
            user.store_domain = user.shopify_domain
        elif user.shopify_domain:
            user.store_platform = "shopify"
            user.store_domain = user.shopify_domain
        else:
            user.store_platform = "none"
            user.store_domain = ""
        user.save(update_fields=["store_platform", "store_domain"])


def noop_reverse(apps, schema_editor):
    # No reverse action required; legacy fields retained for compatibility.
    return


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0002_user_has_shopify_store_and_walkthrough"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="store_domain",
            field=models.CharField(
                blank=True,
                help_text="Primary storefront domain or URL connected to ReturnShield.",
                max_length=255,
            ),
        ),
        migrations.AddField(
            model_name="user",
            name="store_platform",
            field=models.CharField(
                choices=[
                    ("none", "Not connected"),
                    ("shopify", "Shopify"),
                    ("bigcommerce", "BigCommerce"),
                    ("woocommerce", "WooCommerce"),
                ],
                default="none",
                help_text="Primary ecommerce platform connected to ReturnShield.",
                max_length=32,
            ),
        ),
        migrations.RunPython(populate_store_platform, noop_reverse),
    ]


