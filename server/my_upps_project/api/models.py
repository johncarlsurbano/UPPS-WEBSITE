from django.db import models


# Create your models here.


class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    # password = models.CharField(max_length=100)
    # confirmpassword = models.CharField(max_length=100)
    # day = models.IntegerField()
    # month = models.CharField(max_length=100)
    # year = models.IntegerField()
    # department = models.CharField(max_length=100)
    # position = models.CharField(max_length=100)
    

    def __str__(self):
        return self.first_name + ' ' + self.last_name


