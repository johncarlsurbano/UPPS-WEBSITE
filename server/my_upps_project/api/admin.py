

# Register your models here.
from django.contrib import admin
from .models import *


# Register your models here.
admin.site.register(PrintRequestDetails)
admin.site.register(PaperType)
admin.site.register(Position)
admin.site.register(Department)
admin.site.register(PrintingType)
admin.site.register(PersonnelPrintRequest)
admin.site.register(FileUpload)
admin.site.register(Bill)
admin.site.register(StudentPrintForm)
admin.site.register(PaymentSlip)
admin.site.register(BookBindingRequestDetails)
admin.site.register(BookBindingPersonnelRequest)
admin.site.register(BookBindingStudentRequest)
admin.site.register(BookBindRequestType)
admin.site.register(LaminationStudentRequest)
admin.site.register(LaminationPersonnelRequest)
admin.site.register(RequestType)
admin.site.register(User)
admin.site.register(InventoryItem)
admin.site.register(StockCard)
admin.site.register(PrintingInventory)
admin.site.register(WorkInProcessInventory)
admin.site.register(WorkInProcessFIFO)