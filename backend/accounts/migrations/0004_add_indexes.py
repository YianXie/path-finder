# Generated manually for performance optimization

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0003_usermodel_saved_items"),
    ]

    operations = [
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_usermodel_email ON accounts_usermodel(email);",
            reverse_sql="DROP INDEX IF EXISTS idx_usermodel_email;",
        ),
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_usermodel_google_sub ON accounts_usermodel(google_sub);",
            reverse_sql="DROP INDEX IF EXISTS idx_usermodel_google_sub;",
        ),
    ]
