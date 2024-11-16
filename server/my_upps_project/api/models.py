from django.db import models
from django import forms


# Create your models here.

request_type = (
    ('print','Printing'),
    ('bookbind', 'Book-Binding',),
    ('laminate', 'Lamination')
)

printing_type = (
    ('cp','Computer Printing'),
    ('ep','Exam Printing'),

)

class PaperType(models.Model):
    paper_type = models.CharField(max_length=100)
    price = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.paper_type
    
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
    request_type_name = models.CharField(max_length=100,choices=request_type,default='Printing')

class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    confirmpassword = models.CharField(max_length=100)
    day = models.IntegerField()
    month = models.CharField(max_length=100)
    year = models.IntegerField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    position = models.ForeignKey(Position, on_delete=models.CASCADE)
    city = models.CharField(max_length=100,null=True)
    barangay = models.CharField(max_length=100, null=True)
    zipcode = models.CharField(max_length=100)
    street_address = models.CharField(max_length=100, null=True)
    code = models.IntegerField(null=True)

    def __str__(self):
        return self.first_name + ' ' + self.last_name


class StudentPrintForm(models.Model):
    first_name = models.CharField(max_length=100 )
    middle_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    contact_number = models.IntegerField()
    department = models.CharField(max_length=100)
    student_id = models.IntegerField()

    def __str__(self):
        return self.first_name + ' ' + self.last_name



class Request(models.Model):
    student_print_form = models.ForeignKey(StudentPrintForm, on_delete=models.CASCADE,blank=True)
    quantity = models.IntegerField()
    request_type_name = models.ForeignKey(PrintingType, on_delete=models.CASCADE,blank=True)
    paper_size = models.ForeignKey(PaperType, on_delete=models.CASCADE,blank=True)
    duplex = models.BooleanField()
    customer_request_status = models.CharField(max_length=100, null=True)
    personnel_request_status = models.CharField(max_length=100, null=True)

    def __str__(self):
        return str(self.student_print_form)


class Queue(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE, blank=True)
    request_date = models.DateField(auto_now_add=True)
    queue_status = models.CharField(max_length=100, default='pending')

    def __str__(self):
        return str(self.request)
    
    


class PrintRequestDetails(models.Model):
    printing_type = models.ForeignKey(PrintingType, on_delete=models.CASCADE)
    paper_type = models.ForeignKey(PaperType, on_delete=models.CASCADE)
    duplex = models.BooleanField()
    quantity = models.IntegerField()

    def __str__(self):
        return self.paper_type.paper_type
    

class PersonnelPrintRequest(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    position = models.ForeignKey(Position, on_delete=models.CASCADE)
    print_request_details = models.ForeignKey(PrintRequestDetails, on_delete=models.CASCADE)
    pdf = models.FileField(upload_to="uploads/", null=True)
    request_status = models.CharField(max_length=10, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 


class QueueDetails(models.Model):
    personnel_print_request = models.ForeignKey(PersonnelPrintRequest, on_delete=models.CASCADE)
    queue_status = models.CharField(max_length=50, default="Pending")
    request_date = models.DateField(auto_now_add=True)

class UpdateQueueDetails(models.Model):
    personnel_print_request = models.ForeignKey(PersonnelPrintRequest, on_delete=models.CASCADE)
    queue_status = models.CharField(max_length=50, default="Pending")
    request_date = models.DateField(auto_now_add=True)

class FileUpload(models.Model):
    pdf = models.FileField(upload_to="uploads/")


class Signatories(models.Model):
    name = models.CharField(max_length=50)
    position = models.CharField(max_length=50)



class Bill(models.Model):
    job_order_number = models.IntegerField(default = 5)
    documentcodenumber = models.CharField(max_length=50, default='FM-USTP-PP-05')
    revnumber = models.IntegerField(default=0)
    effective_date = models.DateField(auto_now_add=True)
    pagenumber = models.CharField(max_length=50, default='1 of 2')
    date = models.DateField(auto_now_add=True)
    request = models.ForeignKey(PersonnelPrintRequest, on_delete=models.CASCADE)
    type = models.CharField(max_length=10, null=True, default='Billing')
    paid_status = models.CharField(default='Unpaid', max_length=10)
    description = models.CharField(max_length=100, null=True)
    unit = models.CharField(max_length=10, default='pcs')
    unitcost = models.IntegerField(null=True)
    totalcost = models.IntegerField(null=True)
    signatories = models.ForeignKey(Signatories, on_delete=models.CASCADE, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

class PrintingInventory(models.Model):
    paper_type = models.OneToOneField(PaperType, on_delete=models.CASCADE)
    onHand = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50,editable=False)

    def save(self, *args, **kwargs):
        # Ensure correct status before saving
        if self.onHand == 0:
            self.status = 'Out-of-Stock'
        elif self.onHand <= 500:
            self.status = 'Low-Stock'
        else:
            self.status = 'In-Stock'
        super().save(*args, **kwargs)




# QTY: 5
# UNIT: pcs
#Description: Exam Printing
#Unit Cost: (papertype.price + papertype / 0.4)
#Total Cost: papertype.price * quantity
