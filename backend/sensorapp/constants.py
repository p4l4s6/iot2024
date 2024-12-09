from django.db import models
from django.utils.translation import gettext_lazy as _


class SensorType(models.IntegerChoices):
    INPUT = 0, _("Input")
    OUTPUT = 1, _("Output")