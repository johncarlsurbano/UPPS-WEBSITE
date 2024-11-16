

# Register your models here.
from django.contrib import admin
from .models import PrintRequestDetails,PaperType,Position,Department,PrintingType,PersonnelPrintRequest,FileUpload,Bill,PrintingInventory

# Register your models here.
admin.site.register(PrintRequestDetails)
admin.site.register(PaperType)
admin.site.register(Position)
admin.site.register(Department)
admin.site.register(PrintingType)
admin.site.register(PersonnelPrintRequest)
admin.site.register(FileUpload)
admin.site.register(Bill)
admin.site.register(PrintingInventory)
