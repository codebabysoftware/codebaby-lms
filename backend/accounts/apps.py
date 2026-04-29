from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    verbose_name = "Accounts & User Management"

    def ready(self):
        """
        Import signals here if signals.py exists.
        Example:
        import accounts.signals
        """
        try:
            import accounts.signals  # noqa
        except ImportError:
            pass