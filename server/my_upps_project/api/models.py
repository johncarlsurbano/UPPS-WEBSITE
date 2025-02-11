from django.db import models
from django import forms
from PyPDF2 import PdfReader
from decimal import Decimal
from django.core.exceptions import ValidationError


# Create your models here.

class ServiceType(models.Model):
    service_type_name = models.CharField(max_length=100)

    def __str__(self):
        return self.service_type_name


class PaperType(models.Model):
    paper_type = models.CharField(max_length=100)
    price = models.DecimalField(
        max_digits=10,  # Total number of digits allowed (including decimal places)
        decimal_places=2,  # Number of decimal places
        null=True,
        blank=True
    )

    def __str__(self):
        return self.paper_type

class InkType(models.Model):
    ink_type_name = models.CharField(max_length=100)
    price = models.DecimalField(
        max_digits=10,  # Total number of digits allowed (including decimal places)
        decimal_places=2,  # Number of decimal places
        null=True,
        blank=True
    )
    def __str__(self):
        return self.ink_type_name
    

class PrintingType(models.Model):
    printing_type_name = models.CharField(max_length=100)

    def __str__(self):
        return self.printing_type_name

class Department(models.Model):
    department_name = models.CharField(max_length=255)

    def __str__(self):
        return self.department_name

class Position(models.Model):
    position_name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.position_name
    
class RequestType(models.Model):
    request_type_name = models.CharField(max_length=100)

    def __str__(self):
        return self.request_type_name


class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=100, default="Personnel")
    password = models.CharField(max_length=100)
    day = models.IntegerField()
    month = models.CharField(max_length=100)
    year = models.IntegerField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    position = models.ForeignKey(Position, on_delete=models.CASCADE)
    city = models.CharField(max_length=100,null=True)
    barangay = models.CharField(max_length=100, null=True)
    zipcode = models.CharField(max_length=100)
    street_address = models.CharField(max_length=100, null=True)
    student_id = models.IntegerField(null=True)
    code = models.IntegerField(null=True)
    account_status = models.CharField(max_length=100, default="Pending")
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.first_name + ' ' + self.last_name

   


class PrintRequestDetails(models.Model):
    printing_type = models.ForeignKey(PrintingType, on_delete=models.CASCADE)
    request_type = models.ForeignKey(RequestType, on_delete=models.CASCADE)
    paper_type = models.ForeignKey(PaperType, on_delete=models.CASCADE)
    duplex = models.BooleanField()
    quantity = models.IntegerField()

    


class PersonnelPrintRequest(models.Model):
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    print_request_details = models.ForeignKey(PrintRequestDetails, on_delete=models.CASCADE)
    pdf = models.FileField(upload_to="uploads/", null=True)
    request_status = models.CharField(max_length=10, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 
    page_count = models.IntegerField(null=True, blank=True)
    urgent = models.BooleanField(default=False, blank=True)
    remarks = models.CharField(max_length=255, blank=True)



    # def get_pdf_page_count(self):
    #     if not self.pdf:
    #         return 0
    #     try:
    #         reader = PdfReader(self.pdf.path)
    #         return len(reader.pages)
    #     except Exception as e:
    #         # Handle any issues (e.g., corrupted file or invalid format)
    #         print(f"Error reading PDF: {e}")
    #         return 0
    



class QueueDetails(models.Model):
    personnel_print_request = models.ForeignKey(PersonnelPrintRequest, on_delete=models.CASCADE)
    queue_status = models.CharField(max_length=50, default="Pending")
    request_date = models.DateField(auto_now_add=True)



class Signatories(models.Model):
    name = models.CharField(max_length=50)
    position = models.CharField(max_length=50)


class StudentPrintForm(models.Model):
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    contact_number = models.IntegerField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    student_id = models.IntegerField()
    pdf = models.FileField(upload_to="uploads/", null=True)
    print_request_details = models.ForeignKey(PrintRequestDetails, on_delete=models.CASCADE)
    page_count = models.IntegerField(null=True, blank=True)
    remarks = models.CharField(max_length=255, blank=True)



    def __str__(self):
        return self.first_name + ' ' + self.last_name
    









##################################################################################################
# BOOK BIND MODELS 
##################################################################################################

class BookBindRequestType(models.Model):
    request_type_name = models.CharField(max_length=100)
    price = models.IntegerField()

    def __str__(self):
        return self.request_type_name
    
class BookBindType(models.Model):
    book_bind_type_name = models.CharField(max_length=100)

    def __str__(self):
        return self.book_bind_type_name
    
    
class BookBindingRequestDetails(models.Model):
    book_bind_type = models.ForeignKey(BookBindType, on_delete=models.CASCADE)
    request_type = models.ForeignKey(BookBindRequestType, on_delete=models.CASCADE)
    paper_type = models.ForeignKey(PaperType, on_delete=models.CASCADE)
    quantity = models.IntegerField()

class BookBindingPersonnelRequest(models.Model):
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True)
    book_binding_request_details = models.ForeignKey(BookBindingRequestDetails, on_delete=models.CASCADE)
    request_status = models.CharField(max_length=10, default="pending")
    pdf = models.FileField(upload_to="uploads/", null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    page_count = models.IntegerField(null=True, blank=True)
    remarks = models.CharField(max_length=255, blank=True)



class BookBindQueue(models.Model):
    book_bind_personnel_request = models.ForeignKey(BookBindingPersonnelRequest, on_delete=models.CASCADE)
    queue_status = models.CharField(max_length=50, default="Pending")
    request_date = models.DateField(auto_now_add=True)



class BookBindingStudentRequest(models.Model):
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    contact_number = models.IntegerField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    student_id = models.IntegerField()
    pdf = models.FileField(upload_to="uploads/", null=True)
    book_binding_request_details = models.ForeignKey(BookBindingRequestDetails, on_delete=models.CASCADE)
    page_count = models.IntegerField(null=True, blank=True)
    remarks = models.CharField(max_length=255, blank=True)





##################################################################################################
# LAMINATION MODELS 
##################################################################################################

class LaminationRequestType(models.Model):
    request_type_name = models.CharField(max_length=100)
    price = models.IntegerField()

    def __str__(self):
        return self.request_type_name
    
class LaminationType(models.Model):
    lamination_type_name = models.CharField(max_length=100)

    def __str__(self):
        return self.lamination_type_name
    

class LaminationRequestDetails(models.Model):
    lamination_type = models.ForeignKey(LaminationType, on_delete=models.CASCADE)
    request_type = models.ForeignKey(LaminationRequestType, on_delete=models.CASCADE)
    paper_type = models.ForeignKey(PaperType, on_delete=models.CASCADE)
    quantity = models.IntegerField()

class LaminationPersonnelRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lamination_request_details = models.ForeignKey(LaminationRequestDetails, on_delete=models.CASCADE)
    pdf = models.FileField(upload_to="uploads/", null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    page_count = models.IntegerField(null=True, blank=True)
    remarks = models.CharField(max_length=255, blank=True)

class LaminationPersonnelQueue(models.Model):
    lamination_personnel_request = models.ForeignKey(LaminationPersonnelRequest, on_delete=models.CASCADE)
    queue_status = models.CharField(max_length=50, default="Pending")
    request_date = models.DateField(auto_now_add=True)


class LaminationStudentRequest(models.Model):
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    contact_number = models.IntegerField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    student_id = models.IntegerField()
    pdf = models.FileField(upload_to="uploads/", null=True)
    lamination_request_details = models.ForeignKey(LaminationRequestDetails, on_delete=models.CASCADE)
    page_count = models.IntegerField(null=True, blank=True)
    remarks = models.CharField(max_length=255, blank=True)







# QTY: 5
# UNIT: pcs
#Description: Exam Printing
#Unit Cost: (papertype.price + papertype / 0.4)
#Total Cost: papertype.price * quantity


class Bill(models.Model):
    job_order_number = models.IntegerField(default = 5)
    documentcodenumber = models.CharField(max_length=50, default='FM-USTP-PP-05')
    revnumber = models.IntegerField(default=0)
    effective_date = models.DateField(auto_now_add=True)
    pagenumber = models.CharField(max_length=50, default='1 of 2')
    date = models.DateField(auto_now_add=True)
    request = models.ForeignKey(PersonnelPrintRequest, on_delete=models.CASCADE, null=True)
    book_bind_request = models.ForeignKey(BookBindingPersonnelRequest, on_delete=models.CASCADE, null=True)
    lamination_request = models.ForeignKey(LaminationPersonnelRequest, on_delete=models.CASCADE, null=True)
    type = models.CharField(max_length=10,)
    paid_status = models.CharField(default='Unpaid', max_length=10)
    description = models.CharField(max_length=100, null=True)
    unit = models.CharField(max_length=10, default='pcs')
    unitcost = models.IntegerField(null=True)
    totalcost = models.IntegerField(null=True)
    signatories = models.ForeignKey(Signatories, on_delete=models.CASCADE, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)


# class JobOrder(models.Model):
#     job_order_number = models.IntegerField(default = 5)
#     documentcodenumber = models.CharField(max_length=50, default='FM-USTP-PP-05')
#     revnumber = models.IntegerField(default=0)
#     effective_date = models.DateField(auto_now_add=True)
#     pagenumber = models.CharField(max_length=50, default='1 of 2')
#     date = models.DateField(auto_now_add=True)
#     request = models.ForeignKey(PersonnelPrintRequest, on_delete=models.CASCADE, null=True)
#     book_bind_request = models.ForeignKey(BookBindingPersonnelRequest, on_delete=models.CASCADE, null=True)
#     lamination_request = models.ForeignKey(LaminationPersonnelRequest, on_delete=models.CASCADE, null=True)
#     type = models.CharField(max_length=10, null=True, default='Job Order')
#     paid_status = models.CharField(default='Unpaid', max_length=10)
#     description = models.CharField(max_length=100, null=True)
#     unit = models.CharField(max_length=10, default='pcs')
#     unitcost = models.IntegerField(null=True)
#     totalcost = models.IntegerField(null=True)
#     signatories = models.ForeignKey(Signatories, on_delete=models.CASCADE, null=True)
#     updated_date = models.DateTimeField(auto_now=True, null=True)


class PaymentSlip(models.Model):
    job_order_number = models.IntegerField(default = 5)
    documentcodenumber = models.CharField(max_length=50, default='FM-USTP-PP-07')
    revnumber = models.IntegerField(default=0)
    effective_date = models.DateField(auto_now_add=True)
    pagenumber = models.CharField(max_length=50, default='1 of 1')
    date = models.DateField(auto_now_add=True)
    type = models.CharField(max_length=10, null=True, default='Payment Slip')
    request = models.ForeignKey(StudentPrintForm, on_delete=models.CASCADE, null=True)
    book_bind_request = models.ForeignKey(BookBindingStudentRequest, on_delete=models.CASCADE, null=True)
    lamination_request = models.ForeignKey(LaminationStudentRequest, on_delete=models.CASCADE, null=True)
    paid_status = models.CharField(default='Unpaid', max_length=10)
    description = models.CharField(max_length=100, null=True)
    unit = models.CharField(max_length=10, default='pcs')
    unitcost = models.IntegerField(null=True)
    totalcost = models.IntegerField(null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)


################# STUDENT QUEUE ########################

class StudentQueueDetails(models.Model):
    student_print_request = models.ForeignKey(PaymentSlip, on_delete=models.CASCADE)
    queue_status = models.CharField(max_length=50, default="Pending")
    request_date = models.DateField(auto_now_add=True)



class BookBindStudentQueue(models.Model):
    book_bind_student_request = models.ForeignKey(PaymentSlip, on_delete=models.CASCADE)
    queue_status = models.CharField(max_length=50, default="Pending")
    request_date = models.DateField(auto_now_add=True)



class LaminationStudentQueue(models.Model):
    lamination_student_request = models.ForeignKey(PaymentSlip, on_delete=models.CASCADE)
    queue_status = models.CharField(max_length=50, default="Pending")
    request_date = models.DateField(auto_now_add=True)


################# STUDENT QUEUE ########################

    


class InventoryItem(models.Model):
    CATEGORY_CHOICES = [
        ('Ink', 'Ink'),
        ('Paper', 'Paper'),
        ('Toner', 'Toner'),
        ('Battery', 'Battery'),
        ('Office Storage', 'Office Storage & Organization'),
        ('Binding', 'Binding'),
        ('Laminating', 'Laminating'),
        ('ID Card', 'ID Card'),
    ]

    name = models.CharField(max_length=255)  # Brand name (e.g., Apple, Orange)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    paper_type = models.ForeignKey(PaperType, on_delete=models.CASCADE, null=True, blank=True)
    stock_number = models.IntegerField(null=True, blank=True)
    unit = models.CharField(max_length=100)
    unit_value = models.DecimalField(max_digits=10, decimal_places=2)
    balance_per_card = models.IntegerField()
    total_value = models.DecimalField(max_digits=15, decimal_places=2, editable=False)
    onhand_per_count = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.paper_type}) - {self.onhand_per_count} reams"

    def save(self, *args, **kwargs):
        # Automatically calculate total_value
        self.total_value = self.balance_per_card * self.unit_value

        # Ensure paper category logic
        if self.category == 'Paper' and self.paper_type:
            existing_inventory = InventoryItem.objects.filter(
                paper_type=self.paper_type, name=self.name
            ).order_by("created_at")

            if existing_inventory.exists():
                # Ensure a new entry is created instead of merging stock
                super().save(*args, **kwargs)
                return

        super().save(*args, **kwargs)

class PrintingInventory(models.Model):
    paper_type = models.OneToOneField("PaperType", on_delete=models.CASCADE)
    onHand = models.IntegerField(null=True, blank=True)  # Stores sheets
    rim = models.IntegerField(blank=True, null=True)  # Stores reams (1 ream = 500 sheets)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50, editable=False)

    SHEETS_PER_REAM = 500  # Define sheets per ream

    def save(self, *args, **kwargs):
        """Automatically log stock changes in StockCard when rim value changes."""
        try:
            previous = PrintingInventory.objects.get(pk=self.pk)
            previous_rim = previous.rim or 0
        except PrintingInventory.DoesNotExist:
            previous_rim = None  # First-time entry

        # Convert sheets to reams before saving
        new_rim = self.onHand // self.SHEETS_PER_REAM if self.onHand else 0
        self.rim = new_rim

        # Detect changes in rim (reams)
        if previous_rim is not None and new_rim != previous_rim:
            quantity_change = abs(new_rim - previous_rim)
            if new_rim > previous_rim:
                receiver = "Supply"
                quantity_received = quantity_change  # Add in reams
                quantity_issued = 0
            else:
                receiver = "Roy M."
                quantity_received = 0
                quantity_issued = quantity_change  # Deduct in reams

            # Create a StockCard entry
            StockCard.objects.create(
                printing_inventory=self,
                receiver=receiver,
                quantity_received=quantity_received,  # In reams
                quantity_issued=quantity_issued,  # In reams
                quantity_on_hand=new_rim,  # In reams
                remarks="Stock updated automatically"
            )

        # Update stock status based on `onHand`
        if self.onHand == 0:
            self.status = "Out-of-Stock"
        elif self.onHand <= self.SHEETS_PER_REAM:
            self.status = "Low-Stock"
        else:
            self.status = "In-Stock"

        super().save(*args, **kwargs)


class RawMaterialsInventory(models.Model):
    inventory_item = models.OneToOneField(InventoryItem, on_delete=models.CASCADE)
    stock_quantity = models.IntegerField(default=0)  # Stock stored here

    def __str__(self):
        return f"{self.inventory_item.name} - Raw Stock: {self.stock_quantity}"

    def deduct_stock(self, quantity):
        """Deduct stock when transferring to Work In Process"""
        if self.stock_quantity >= quantity:
            self.stock_quantity -= quantity
            self.save()
            return True
        return False  # Not enough stock

    def add_stock(self, quantity):
        """Increase stock when new stock arrives"""
        self.stock_quantity += quantity
        self.save()


class WorkInProcessInventory(models.Model):
    inventory_item = models.OneToOneField(InventoryItem, on_delete=models.CASCADE)
    stock_quantity = models.IntegerField(default=0)  # Stock stored here

    def __str__(self):
        return f"{self.inventory_item.name} - Work In Process Stock: {self.stock_quantity}"

    def add_stock(self, quantity):
        """Increase stock when receiving from Raw Materials"""
        self.stock_quantity += quantity
        self.save()



class StockCard(models.Model):
    printing_inventory = models.ForeignKey("PrintingInventory", on_delete=models.CASCADE)
    issued = models.DateField(auto_now_add=True)
    requisition = models.CharField(max_length=50, null=True, blank=True)
    receiver = models.CharField(max_length=100,null=True, blank=True)
    quantity_received = models.IntegerField(null=True, blank=True, default=0)
    quantity_issued = models.IntegerField(null=True, blank=True, default=0)
    quantity_on_hand = models.IntegerField(null=True,blank=True)
    remarks = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.printing_inventory.paper_type} - {self.issued}"



class FileUpload(models.Model):
    pdf = models.FileField(upload_to="uploads/")