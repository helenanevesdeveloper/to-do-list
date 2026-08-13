from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("tasks", "0001_initial"),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name="tasksharemodel",
            name="chk_task_shares_permission",
        ),
        migrations.RunSQL(
            sql=(
                "UPDATE task_shares "
                "SET permission = 'reader' "
                "WHERE permission IN ('view', 'edit')"
            ),
            reverse_sql=(
                "UPDATE task_shares "
                "SET permission = 'view' "
                "WHERE permission = 'reader'"
            ),
        ),
        migrations.AlterField(
            model_name="tasksharemodel",
            name="permission",
            field=models.CharField(
                choices=[("reader", "Leitor")],
                max_length=16,
            ),
        ),
        migrations.AddConstraint(
            model_name="tasksharemodel",
            constraint=models.CheckConstraint(
                condition=models.Q(("permission__in", ["reader"])),
                name="chk_task_shares_permission",
            ),
        ),
    ]
