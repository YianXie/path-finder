# Generated manually for performance optimization

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("suggestions", "0004_alter_suggestionmodel_description_and_more"),
    ]

    operations = [
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_suggestionmodel_name ON suggestions_suggestionmodel(name);",
            reverse_sql="DROP INDEX IF EXISTS idx_suggestionmodel_name;",
        ),
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_suggestionmodel_external_id ON suggestions_suggestionmodel(external_id);",
            reverse_sql="DROP INDEX IF EXISTS idx_suggestionmodel_external_id;",
        ),
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_suggestionmodel_created_at ON suggestions_suggestionmodel(created_at);",
            reverse_sql="DROP INDEX IF EXISTS idx_suggestionmodel_created_at;",
        ),
    ]
