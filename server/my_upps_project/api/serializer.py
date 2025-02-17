from rest_framework import serializers
from .models import *
import math
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
         model = User
         fields = "__all__"   

    def validate(self, data):
         if 'email' in data:
             email = data['email']
             if User.objects.filter(email=email).exists():
                  raise serializers.ValidationError("Email already exists")
         return data
    
    def create(self, validated_data):
         if 'password' not in validated_data or not validated_data['password']:
              raise serializers.ValidationError("Password is required")

         if 'email' not in validated_data or not validated_data['email']:
              raise serializers.ValidationError("Email is required")
         
         validated_data['password'] = make_password(validated_data['password'])
         return super().create(validated_data)





class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data['email']
        password = data['password']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"message": "Invalid email"})
        
        if not check_password(password, user.password):  # Ensure the password comparison is happening with hashed password
            raise serializers.ValidationError({"message": "Invalid password"})
        
        data['user'] = user 
        return data


     


class StudentFormSerializer(serializers.ModelSerializer):
     class Meta:
          model = StudentPrintForm
          fields = "__all__"   


class ServiceTypeSerializer(serializers.ModelSerializer):
     class Meta:
          model = ServiceType
          fields = "__all__"

class RequestTypeSerializer(serializers.ModelSerializer):
     class Meta:
          model = RequestType
          fields = "__all__"

class PaperTypeSerializer(serializers.ModelSerializer):
     class Meta:
          model = PaperType
          fields = "__all__"



class DepartmentSerializer(serializers.ModelSerializer):
     class Meta:
          model=Department
          fields= "__all__"

class PositionSerializer(serializers.ModelSerializer):
     class Meta:
          model=Position
          fields= "__all__"

class PrintRequestDetailsSerializer(serializers.ModelSerializer):
     class Meta:
          model=PrintRequestDetails
          fields =  "__all__"


     

class PrintingTypeSerializer(serializers.ModelSerializer):
     printing_type = serializers.CharField(source='printing_type.printing_type_name'),
     class Meta:
          model= PrintingType
          fields= "__all__"



class UserRequestSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer()  # Use nested serializer for department
    position = PositionSerializer()  # Use nested serializer for position

    class Meta:
        model = User
        fields = ['id','first_name', 'last_name', 'email', 'role', 'department', 'position', 'street_address', 'barangay', 'city', 'account_status']


class GetUserSerializer(serializers.ModelSerializer):
     department = DepartmentSerializer(read_only=True)
     position = PositionSerializer(read_only=True)

     class Meta:
          model = User
          fields = "__all__"



class PersonnelPrintRequestSerializer(serializers.ModelSerializer):
     print_request_details = PrintRequestDetailsSerializer()
     
     class Meta:
          model= PersonnelPrintRequest
          fields="__all__"

           
     def create(self, validated_data):
          
          print_request_details_data = validated_data.pop('print_request_details')

          department_name = validated_data.pop('department')['department_name']
          position_name = validated_data.pop('position')['position_name']

          department = Department.objects.get_or_create(department_name=department_name)[0]
          position = Position.objects.get_or_create(position_name=position_name)[0]
          
          
          printing_type_data = print_request_details_data.pop('printing_type')
          paper_type_data = print_request_details_data.pop('paper_type')
          
          
          printing_type = PrintingType.objects.get_or_create(**printing_type_data)[0]
          paper_type = PaperType.objects.get_or_create(**paper_type_data)[0]

          
          
          
          print_request_details = PrintRequestDetails.objects.create(
               printing_type=printing_type,
               paper_type=paper_type,
               **print_request_details_data
          )
          
          
          personnel_print_request = PersonnelPrintRequest.objects.create(
               department=department,
               position=position,
               print_request_details=print_request_details,
               **validated_data
          )
          
          return personnel_print_request

class QueueSerializer(serializers.ModelSerializer):
     
     class Meta:
          model=QueueDetails
          fields= "__all__"


class EditRequestSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(source='personnel_print_request.print_request_details.quantity', required=False)
    paper_type = serializers.PrimaryKeyRelatedField(
        queryset=PaperType.objects.all(),
        source='personnel_print_request.print_request_details.paper_type',
        required=False
    )
    pdf = serializers.FileField(source='personnel_print_request.pdf', required=False)

    class Meta:
        model = QueueDetails
        fields = ['quantity', 'paper_type', 'pdf']  # Only these fields are editable

    def update(self, instance, validated_data):
        personnel_print_request = instance.personnel_print_request
        print_request_details = personnel_print_request.print_request_details

        # Update quantity if provided
        if 'personnel_print_request' in validated_data:
            personnel_data = validated_data['personnel_print_request']
            
            # Update PrintRequestDetails fields if present
            if 'print_request_details' in personnel_data:
                print_details_data = personnel_data['print_request_details']
                
                if 'quantity' in print_details_data:
                    print_request_details.quantity = print_details_data['quantity']
                
                if 'paper_type' in print_details_data:
                    print_request_details.paper_type = print_details_data['paper_type']

            # Update PDF file if provided
            if 'pdf' in personnel_data:
                personnel_print_request.pdf = personnel_data['pdf']

        # Save updates
        print_request_details.save()
        personnel_print_request.save()

        return instance




#==========================================================================

class PrintRequestSerializer(serializers.ModelSerializer):
     class Meta:
          model=PrintRequestDetails
          fields = ['printing_type', 'paper_type', 'duplex', 'quantity']


class CreateRequestSerializer(serializers.ModelSerializer):
 
     class Meta:
          model = PersonnelPrintRequest
          fields = "__all__"
     


class DisplayPrintDetailsSerializer(serializers.ModelSerializer):
     printing_type = PrintingTypeSerializer(read_only=True)
     paper_type = PaperTypeSerializer(read_only=True)
     request_type = RequestTypeSerializer(read_only=True)

     class Meta:
          model = PrintRequestDetails
          fields = "__all__"



class DisplayPersonnelPrintRequestSerializer(serializers.ModelSerializer):
     personnel_print_request = PersonnelPrintRequestSerializer(read_only=True)
     user = UserRequestSerializer(read_only=True)
     department = DepartmentSerializer(read_only=True)
     position = PositionSerializer(read_only=True)
     print_request_details = DisplayPrintDetailsSerializer(read_only=True)
     service_type = ServiceTypeSerializer(read_only=True)

     
     class Meta:
          model = PersonnelPrintRequest
          fields = "__all__"

class DisplayPendingRequestSerializer(serializers.ModelSerializer):
     personnel_print_request = PersonnelPrintRequestSerializer(read_only=True)
     user = UserRequestSerializer(read_only=True)
     department = DepartmentSerializer(read_only=True)
     position = PositionSerializer(read_only=True)
     print_request_details = PrintRequestSerializer(read_only=True)
     print_request_details = DisplayPrintDetailsSerializer(read_only=True) 
     pdf = serializers.FileField(read_only=True)  # Mark as read-only


     class Meta:
          model = PersonnelPrintRequest
          fields = "__all__"


class DisplayPersonnelPrintRequestQueueSerializer(serializers.ModelSerializer):
     personnel_print_request = DisplayPersonnelPrintRequestSerializer(read_only=True)
     
     class Meta:
          model = QueueDetails
          fields = "__all__"








# class BillSerializer(serializers.ModelSerializer):
#     unitcost = serializers.SerializerMethodField()
#     totalcost = serializers.SerializerMethodField()

#     class Meta:
#         model = Bill
#         fields = '__all__'

#     def get_unitcost(self, obj):
#         print_request_details = obj.request.print_request_details
#         base_price = print_request_details.paper_type.price
#         return base_price * 1.2 if print_request_details.duplex else base_price

#     def get_totalcost(self, obj):
#         print_request_details = obj.request.print_request_details
#         quantity = print_request_details.quantity
#         page_count = obj.request.page_count
#         unitcost = self.get_unitcost(obj)

#         total_pages = page_count * quantity
        
#         return total_pages * unitcost

#     def create(self, validated_data):
#           # Create the Bill instance
#           bill = super().create(validated_data)

#           # Get the requested paper type, quantity, and page count from the bill details
#           print_request_details = bill.request.print_request_details
#           paper_type = print_request_details.paper_type
#           quantity = print_request_details.quantity
#           page_count = bill.request.page_count  # Ensure `page_count` is available in the request

#           # Calculate the total pages to be deducted
#           total_pages = page_count * quantity

#           # Retrieve or create the inventory for the paper type
#           inventory, created = PrintingInventory.objects.get_or_create(
#                paper_type=paper_type,
#                defaults={'onHand': 0, 'status': 'Out-of-Stock'}
#           )

#           # Subtract the total pages from onHand and update the inventory status
#           inventory.onHand = max(0, inventory.onHand - total_pages)
#           inventory.save()  # Save will automatically update the status

#           return bill

# class DisplayBillRequestDetailsSerializer(serializers.ModelSerializer):
#      request = DisplayPersonnelPrintRequestSerializer()
#      unitcost = serializers.SerializerMethodField()
#      totalcost = serializers.SerializerMethodField()

#      class Meta:
#           model = Bill
#           fields = "__all__"

#      def get_unitcost(self, obj):
#         print_request_details = obj.request.print_request_details
#         base_price = print_request_details.paper_type.price
#         return base_price * 1.2 if print_request_details.duplex else base_price

#      def get_totalcost(self, obj):
#           print_request_details = getattr(obj.request, 'print_request_details', None)
#           if not print_request_details:
#                return 0  # Default value when print_request_details is missing

#           quantity = getattr(print_request_details, 'quantity', 0) or 0
#           page_count = getattr(obj.request, 'page_count', 0) or 0
#           unitcost = self.get_unitcost(obj)

#           if unitcost is None:  # Handle None case for unitcost
#                unitcost = 0

#           total_pages = page_count * quantity

#           return total_pages * unitcost

#      def create(self, validated_data):
#           # Create the Bill instance
#           bill = super().create(validated_data)

#           # Get the requested paper type, quantity, and page count from the bill details
#           print_request_details = bill.request.print_request_details
#           paper_type = print_request_details.paper_type
#           quantity = print_request_details.quantity
#           page_count = bill.request.page_count  # Ensure `page_count` is available in the request

#           # Calculate the total pages to be deducted
#           total_pages = page_count * quantity

#           # Retrieve or create the inventory for the paper type
#           inventory, created = PrintingInventory.objects.get_or_create(
#                paper_type=paper_type,
#                defaults={'onHand': 0, 'status': 'Out-of-Stock'}
#           )

#           # Subtract the total pages from onHand and update the inventory status
#           inventory.onHand = max(0, inventory.onHand - total_pages)
#           inventory.save()  # Save will automatically update the status

#           return bill


class DisplayPrintInventorySerializer(serializers.ModelSerializer):
     paper_type = PaperTypeSerializer(read_only=True)
     class Meta:
          model = PrintingInventory
          fields = "__all__"



class UpdatePrintingInventorySerializer(serializers.ModelSerializer):
    paper_type = PaperTypeSerializer()

    class Meta:
        model = PrintingInventory
        fields = '__all__'
        read_only_fields = ['status']  # Make `status` read-only

    def update(self, instance, validated_data):
        # Update the `paper_type` field only
        paper_type_data = validated_data.get('paper_type')
        if paper_type_data:
            for attr, value in paper_type_data.items():
                setattr(instance.paper_type, attr, value)
            instance.paper_type.save()  # Save changes to `PaperType`

        # Save the inventory instance to apply any additional changes
        instance.save()
        return instance

    
class AddItemPrintingSerializer(serializers.ModelSerializer):
    paper_type = PaperTypeSerializer()

    class Meta:
        model = PrintingInventory
        fields = '__all__'

    def create(self, validated_data):
     # Extract paper_type data from validated data
     paper_type_data = validated_data.pop('paper_type')

     # Find or create the PaperType instance
     paper_type, created = PaperType.objects.get_or_create(**paper_type_data)

     # Extract the rim value (default to 0 if not provided)
     rim = validated_data.pop('rim', 0)

     # Calculate additional onHand based on the rim
     additional_onHand = rim * 500  # 1 rim = 500 onHand

     # Check if the paper type already exists in the inventory
     inventory_item = PrintingInventory.objects.filter(paper_type=paper_type).first()

     if inventory_item:
          # If the item already exists, update the rim and onHand
          inventory_item.onHand += additional_onHand
          inventory_item.rim = inventory_item.onHand // 500  # Update rim based on new onHand
          inventory_item.save()
          return inventory_item
     else:
          # If the paper type doesn't exist, create a new inventory item
          validated_data['onHand'] = additional_onHand
          validated_data['rim'] = rim  # Set the initial rim value
          printing_inventory = PrintingInventory.objects.create(paper_type=paper_type, **validated_data)
          return printing_inventory
     
class AddReamPrintingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrintingInventory
        fields = ['paper_type', 'rim']

    def to_internal_value(self, data):
        # Remove onHand from the incoming data, as it is calculated dynamically
        if 'onHand' in data:
            data.pop('onHand')
        return super().to_internal_value(data)

    def create(self, validated_data):
        # Extract the paper_type instance and rim value
        paper_type_data = validated_data.pop('paper_type')
        paper_type, created = PaperType.objects.get_or_create(**paper_type_data)

        rim = validated_data.get('rim', 0)
        additional_onHand = rim * 500  # 1 ream = 500 onHand

        # Find the existing inventory item for the paper type
        inventory_item = PrintingInventory.objects.filter(paper_type=paper_type).first()

        if inventory_item:
            # Update the onHand and rim values
            inventory_item.onHand += additional_onHand
            inventory_item.rim = inventory_item.onHand // 500
            inventory_item.save()
            return inventory_item
        else:
            # If no inventory exists for this paper type, create one
            return PrintingInventory.objects.create(
                paper_type=paper_type,
                rim=rim,
                onHand=additional_onHand,
            )




        



class SignatoriesSerializer(serializers.ModelSerializer):
     class Meta:
          model = Signatories
          fields = "__all__"


class DisplayStudentFormSerializer(serializers.ModelSerializer):
     department = DepartmentSerializer(read_only=True)
     print_request_details = DisplayPrintDetailsSerializer(read_only=True)
     service_type = ServiceTypeSerializer(read_only=True)


     class Meta:
          model = StudentPrintForm
          fields = "__all__"





# class PaymentSlipSerializer(serializers.ModelSerializer):
#      unitcost = serializers.SerializerMethodField()
#      totalcost = serializers.SerializerMethodField()

#      class Meta:
#           model = PaymentSlip
#           fields = "__all__"

#      def get_unitcost(self, obj):
#         print_request_details = obj.request.print_request_details
#         base_price = print_request_details.paper_type.price
#         return round(base_price * 1.2 if print_request_details.duplex else base_price, 2)

#      def get_totalcost(self, obj):
#         print_request_details = obj.request.print_request_details
#         quantity = print_request_details.quantity
#         unitcost = self.get_unitcost(obj)
#         return round(quantity * unitcost, 2)

#      def update(self, instance, validated_data):

#           current_status = instance.paid_status

   
#           paymentslip = super().update(instance, validated_data)

     
#           if current_status != 'Paid' and paymentslip.paid_status == 'Paid':
              
#                paper_type = paymentslip.request.print_request_details.paper_type
#                quantity = paymentslip.request.print_request_details.quantity

              
#                inventory, created = PrintingInventory.objects.get_or_create(
#                     paper_type=paper_type,
#                     defaults={'onHand': 0, 'status': 'Out-of-Stock'}
#                )

              
#                inventory.onHand = max(0, inventory.onHand - quantity)
#                inventory.save()

#           return paymentslip

# class DisplayPaymentSlipSerializer(serializers.ModelSerializer):
#      request = DisplayStudentFormSerializer(read_only=True)
#      unitcost = serializers.SerializerMethodField()
#      totalcost = serializers.SerializerMethodField()

#      class Meta: 
#           model = PaymentSlip
#           fields = "__all__"

#      def get_unitcost(self, obj):
#           print_request_details = obj.request.print_request_details
#           base_price = print_request_details.paper_type.price
#           return base_price * 1.2 if print_request_details.duplex else base_price

#      def get_totalcost(self, obj):
#           print_request_details = obj.request.print_request_details
#           quantity = print_request_details.quantity
#           unitcost = self.get_unitcost(obj)
#           return round(quantity * unitcost, 2)

#      def update(self, instance, validated_data):
#     # Retrieve the current paid_status before update
#           current_status = instance.paid_status

#           # Update the PaymentSlip instance with the new validated data
#           paymentslip = super().update(instance, validated_data)

#           # Check if the paid_status is updated to 'Paid'
#           if current_status != 'Paid' and paymentslip.paid_status == 'Paid':
#                # Access the paper_type and quantity from the associated print request
#                paper_type = paymentslip.request.print_request_details.paper_type
#                quantity = paymentslip.request.print_request_details.quantity

#                # Retrieve or create the corresponding PrintingInventory entry
#                inventory, created = PrintingInventory.objects.get_or_create(
#                     paper_type=paper_type,
#                     defaults={'onHand': 0, 'status': 'Out-of-Stock'}
#                )

#                # Deduct the quantity from the onHand value and save the inventory
#                inventory.onHand = max(0, inventory.onHand - quantity)
#                inventory.save()

#           return paymentslip


     

##################################################################################################
# BOOK BIND SERIALIZER 
##################################################################################################

class TypeBookBindSerializer(serializers.ModelSerializer):
     class Meta:
          model = BookBindType
          fields = "__all__"

class BookBindRequestTypeSerializer(serializers.ModelSerializer):
     class Meta:
          model = BookBindRequestType
          fields = "__all__"

class BookBindRequestDetailsSerializer(serializers.ModelSerializer):
     class Meta:
          model = BookBindingRequestDetails
          fields = "__all__"

class DisplayBookBindRequestDetailsSerializer(serializers.ModelSerializer):
     paper_type = PaperTypeSerializer(read_only=True)
     request_type = BookBindRequestTypeSerializer(read_only=True)
     

     class Meta:
          model = BookBindingRequestDetails
          fields = "__all__"

class BookBindPersonnelRequestSerializer(serializers.ModelSerializer):
     class Meta:
          model = BookBindingPersonnelRequest
          fields = "__all__"

class DisplayBookBindPersonnelRequestSerializer(serializers.ModelSerializer):
     book_binding_request_details = DisplayBookBindRequestDetailsSerializer(read_only=True)
     user = GetUserSerializer(read_only=True)
     service_type = ServiceTypeSerializer(read_only=True)

     class Meta:
          model = BookBindingPersonnelRequest
          fields = "__all__"

class BookBindPersonnelQueueSerializer(serializers.ModelSerializer):
     class Meta:
          model = BookBindQueue
          fields = "__all__"

class DisplayBookBindPersonnelQueueSerializer(serializers.ModelSerializer):
     book_bind_personnel_request = DisplayBookBindPersonnelRequestSerializer(read_only=True)
     class Meta:
          model = BookBindQueue
          fields = "__all__"


class BookBindStudentRequestSerializer(serializers.ModelSerializer):
     class Meta: 
          model = BookBindingStudentRequest
          fields = "__all__"

class DisplayBookBindStudentRequestSerializer(serializers.ModelSerializer):
     department = DepartmentSerializer(read_only=True)
     book_binding_request_details = DisplayBookBindRequestDetailsSerializer(read_only=True)
     service_type = ServiceTypeSerializer(read_only=True)
     class Meta:
          model = BookBindingStudentRequest
          fields = "__all__"

class EditBookBindRequestSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(source='book_bind_personnel_request.book_binding_request_details.quantity', required=False)
    paper_type = serializers.PrimaryKeyRelatedField(
        queryset=PaperType.objects.all(),
        source='book_bind_personnel_request.book_binding_request_details.paper_type',
        required=False
    )
    pdf = serializers.FileField(source='book_bind_personnel_request.pdf', required=False)

    class Meta:
        model = BookBindQueue
        fields = ['quantity', 'paper_type', 'pdf']  # Only these fields are editable

    def update(self, instance, validated_data):
        book_bind_personnel_request = instance.book_bind_personnel_request
        book_binding_request_details = book_bind_personnel_request.book_binding_request_details

        # Update quantity and paper type if provided
        if 'book_bind_personnel_request' in validated_data:
            personnel_data = validated_data['book_bind_personnel_request']
            
            # Update BookBindingRequestDetails fields if present
            if 'book_binding_request_details' in personnel_data:
                book_details_data = personnel_data['book_binding_request_details']
                
                if 'quantity' in book_details_data:
                    book_binding_request_details.quantity = book_details_data['quantity']
                
                if 'paper_type' in book_details_data:
                    book_binding_request_details.paper_type = book_details_data['paper_type']

            # Update PDF file if provided
            if 'pdf' in personnel_data:
                book_bind_personnel_request.pdf = personnel_data['pdf']

        # Save updates
        book_binding_request_details.save()
        book_bind_personnel_request.save()

        return instance






##################################################################################################
# LAMINATION SERIALIZER 
##################################################################################################

class TypeLaminationSerializer(serializers.ModelSerializer):
     class Meta:
          model = LaminationType
          fields = "__all__"

class LaminationTypeSerializer(serializers.ModelSerializer):
     class Meta:
          model = LaminationRequestType
          fields = "__all__"

class LaminationRequestDetailsSerializer(serializers.ModelSerializer):
     class Meta:
          model = LaminationRequestDetails
          fields = "__all__"

class DisplayLaminationRequestDetailsSerializer(serializers.ModelSerializer):
     request_type = LaminationTypeSerializer(read_only=True)
     paper_type = PaperTypeSerializer(read_only=True)
     class Meta:
          model = LaminationRequestDetails
          fields = "__all__"

class LaminationPersonnelRequestSerializer(serializers.ModelSerializer):
     class Meta:
          model = LaminationPersonnelRequest
          fields = "__all__"

class DisplayLaminationPersonnelRequestSerializer(serializers.ModelSerializer):
     lamination_request_details = DisplayLaminationRequestDetailsSerializer(read_only=True)
     user = GetUserSerializer(read_only=True)
     service_type = ServiceTypeSerializer(read_only=True)

     class Meta:
          model = LaminationPersonnelRequest
          fields = "__all__"

class LaminationPersonnelQueueSerializer(serializers.ModelSerializer):
     class Meta:
          model = LaminationPersonnelQueue
          fields = "__all__"

class DisplayLaminationPersonnelQueueSerializer(serializers.ModelSerializer):
     lamination_personnel_request = DisplayLaminationPersonnelRequestSerializer(read_only=True)


     class Meta:
          model = LaminationPersonnelQueue
          fields = "__all__"

class LaminationStudentRequestSerializer(serializers.ModelSerializer):
     class Meta:
          model = LaminationStudentRequest
          fields = "__all__"

class DisplayLaminationStudentRequestSerializer(serializers.ModelSerializer):
     department = DepartmentSerializer(read_only=True)
     lamination_request_details = DisplayLaminationRequestDetailsSerializer(read_only=True)
     service_type = ServiceTypeSerializer(read_only=True)

     class Meta: 
          model = LaminationStudentRequest
          fields = "__all__"


class EditLaminationSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(source='lamination_personnel_request.lamination_request_details.quantity', required=False)
    paper_type = serializers.PrimaryKeyRelatedField(
        queryset=PaperType.objects.all(),
        source='lamination_personnel_request.lamination_request_details.paper_type',
        required=False
    )
    pdf = serializers.FileField(source='lamination_personnel_request.pdf', required=False)

    class Meta:
        model = BookBindQueue
        fields = ['quantity', 'paper_type', 'pdf']  # Only these fields are editable

    def update(self, instance, validated_data):
        lamination_personnel_request = instance.lamination_personnel_request
        lamination_request_details = lamination_personnel_request.lamination_request_details

        # Update quantity and paper type if provided
        if 'lamination_personnel_request' in validated_data:
            personnel_data = validated_data['lamination_personnel_request']
            
            # Update BookBindingRequestDetails fields if present
            if 'lamination_request_details' in personnel_data:
                lamination_details_data = personnel_data['lamination_request_details']
                
                if 'quantity' in lamination_details_data:
                    lamination_request_details.quantity = lamination_details_data['quantity']
                
                if 'paper_type' in lamination_details_data:
                    lamination_request_details.paper_type = lamination_details_data['paper_type']

            # Update PDF file if provided
            if 'pdf' in personnel_data:
                lamination_personnel_request.pdf = personnel_data['pdf']

        # Save updates
        lamination_request_details.save()
        lamination_personnel_request.save()

        return instance



     





class BillSerializer(serializers.ModelSerializer):
    # Use SerializerMethodField to conditionally display either print or book bind request details
    
    request_details = serializers.SerializerMethodField()
    unitcost = serializers.SerializerMethodField()
    totalcost = serializers.SerializerMethodField()

    class Meta:
        model = Bill
        fields = "__all__"

    def get_request_details(self, obj):
        # Check if the Bill has a PersonnelPrintRequest or BookBindingPersonnelRequest
        if obj.request:
            return DisplayPersonnelPrintRequestSerializer(obj.request).data
        elif obj.book_bind_request:
            return DisplayBookBindPersonnelRequestSerializer(obj.book_bind_request).data
        elif obj.lamination_request:
            return DisplayLaminationPersonnelRequestSerializer(obj.lamination_request).data
        return None  # Return None if neither request type is available

    def get_unitcost(self, obj):
        # Check if it's a print request or a book bind request and calculate unit cost accordingly
        if obj.request:
            print_request_details = obj.request.print_request_details
            base_price = print_request_details.paper_type.price
            return base_price
        elif obj.book_bind_request:
            book_binding_request_details = obj.book_bind_request.book_binding_request_details
            return book_binding_request_details.paper_type.price
        elif obj.lamination_request:
             lamination_request_details = obj.lamination_request.lamination_request_details
             return lamination_request_details.paper_type.price
        return 0  # Default unit cost if neither request type is available

    def get_totalcost(self, obj):
        # Calculate total cost based on request details
        unitcost = self.get_unitcost(obj)

        if obj.request:
            print_request_details = obj.request.print_request_details
            quantity = print_request_details.quantity
            page_count = obj.request.page_count
            total_pages = page_count * quantity
            return total_pages * unitcost
        
        elif obj.book_bind_request:
            book_binding_request_details = obj.book_bind_request.book_binding_request_details
            price = book_binding_request_details.request_type.price
            page_count = obj.book_bind_request.page_count
            quantity = book_binding_request_details.quantity
            total_pages = page_count * quantity
            
            return price + total_pages * unitcost
     
        elif obj.lamination_request:
             lamination_request_details = obj.lamination_request.lamination_request_details
             price = lamination_request_details.request_type.price
             page_count = obj.lamination_request.page_count
             quantity = lamination_request_details.quantity
             total_pages = page_count * quantity

             return price + total_pages * unitcost
        
        return 0  # Default total cost if neither request type is available

    def create(self, validated_data):
          # Create the Bill instance
          bill = super().create(validated_data)

          # Handle inventory deduction based on the type of request (print, book bind, or lamination)
          if bill.request:
               print_request_details = bill.request.print_request_details
               paper_type = print_request_details.paper_type
               quantity = print_request_details.quantity
               page_count = bill.request.page_count

               # Adjust total_pages for duplex
               if print_request_details.duplex:
                    total_pages = (page_count * quantity) / 2
               else:
                    total_pages = page_count * quantity

               # Retrieve or create the inventory for the paper type
               inventory, created = PrintingInventory.objects.get_or_create(
                    paper_type=paper_type,
                    defaults={'onHand': 0, 'status': 'Out-of-Stock'}
               )

               # Subtract the total pages from onHand and update the inventory status
               inventory.onHand = max(0, inventory.onHand - math.ceil(total_pages))
               inventory.save()

          elif bill.book_bind_request:
               book_binding_request_details = bill.book_bind_request.book_binding_request_details
               quantity = book_binding_request_details.quantity
               paper_type = book_binding_request_details.paper_type
               page_count = bill.book_bind_request.page_count
               total_pages = page_count * quantity

               # Retrieve or create the inventory for the paper type
               inventory, created = PrintingInventory.objects.get_or_create(
                    paper_type=paper_type,
                    defaults={'onHand': 0, 'status': 'Out-of-Stock'}
               )

               # Subtract the total pages from onHand and update the inventory status
               inventory.onHand = max(0, inventory.onHand - total_pages)
               inventory.save()

          elif bill.lamination_request:
               lamination_request_details = bill.lamination_request.lamination_request_details
               page_count = bill.lamination_request.page_count
               quantity = lamination_request_details.quantity
               paper_type = lamination_request_details.paper_type
               total_pages = page_count * quantity

               # Retrieve or create the inventory for the paper type
               inventory, created = PrintingInventory.objects.get_or_create(
                    paper_type=paper_type,
                    defaults={'onHand': 0, 'status': 'Out-of-Stock'}
               )

               # Subtract the total pages from onHand and update the inventory status
               inventory.onHand = max(0, inventory.onHand - total_pages)
               inventory.save()

          return bill
          

class DisplayBillRequestDetailsSerializer(serializers.ModelSerializer):
    # Use SerializerMethodField to conditionally display either print or book bind request details

    request_details = serializers.SerializerMethodField()
    unitcost = serializers.SerializerMethodField()
    totalcost = serializers.SerializerMethodField()

    class Meta:
        model = Bill
        fields = "__all__"

    def get_request_details(self, obj):
        # Check if the Bill has a PersonnelPrintRequest or BookBindingPersonnelRequest
        if obj.request:
            return DisplayPersonnelPrintRequestSerializer(obj.request).data
        elif obj.book_bind_request:
            return DisplayBookBindPersonnelRequestSerializer(obj.book_bind_request).data
        elif obj.lamination_request:
             return DisplayLaminationPersonnelRequestSerializer(obj.lamination_request).data 
        return None  # Return None if neither request type is available

    def get_unitcost(self, obj):
        # Check if it's a print request or a book bind request and calculate unit cost accordingly
        if obj.request:
            print_request_details = obj.request.print_request_details
            base_price = print_request_details.paper_type.price
            return base_price
        
        elif obj.book_bind_request:
            book_binding_request_details = obj.book_bind_request.book_binding_request_details
            return book_binding_request_details.paper_type.price
        
        elif obj.lamination_request:
             lamination_request_details = obj.lamination_request.lamination_request_details
             return lamination_request_details.paper_type.price
        return 0  # Default unit cost if neither request type is available

    def get_totalcost(self, obj):
        # Calculate total cost based on request details
        unitcost = self.get_unitcost(obj)

        if obj.request:
            print_request_details = obj.request.print_request_details
            quantity = print_request_details.quantity
            page_count = obj.request.page_count
            total_pages = page_count * quantity

            return total_pages * unitcost
        
        elif obj.book_bind_request:
            book_binding_request_details = obj.book_bind_request.book_binding_request_details
            price = book_binding_request_details.request_type.price
            page_count = obj.book_bind_request.page_count
            quantity = book_binding_request_details.quantity
            total_pages = page_count * quantity
            
            return price + total_pages * unitcost
        
        elif obj.lamination_request:
             lamination_request_details = obj.lamination_request.lamination_request_details
             price = lamination_request_details.request_type.price
             page_count = obj.lamination_request.page_count
             quantity = lamination_request_details.quantity
             total_pages = page_count * quantity

             return price + total_pages * unitcost
        
        return 0  # Default total cost if neither request type is available

    def create(self, validated_data):
          # Create the Bill instance
          bill = super().create(validated_data)

          # Handle inventory deduction based on the type of request (print, book bind, or lamination)
          if bill.request:
               print_request_details = bill.request.print_request_details
               paper_type = print_request_details.paper_type
               quantity = print_request_details.quantity
               page_count = bill.request.page_count

               # Adjust total_pages for duplex
               if print_request_details.duplex:
                    total_pages = (page_count * quantity) / 2
               else:
                    total_pages = page_count * quantity

               # Retrieve or create the inventory for the paper type
               inventory, created = PrintingInventory.objects.get_or_create(
                    paper_type=paper_type,
                    defaults={'onHand': 0, 'status': 'Out-of-Stock'}
               )

               # Subtract the total pages from onHand and update the inventory status
               inventory.onHand = max(0, inventory.onHand - math.ceil(total_pages))
               inventory.save()

          elif bill.book_bind_request:
               book_binding_request_details = bill.book_bind_request.book_binding_request_details
               quantity = book_binding_request_details.quantity
               paper_type = book_binding_request_details.paper_type
               page_count = bill.book_bind_request.page_count
               total_pages = page_count * quantity

               # Retrieve or create the inventory for the paper type
               inventory, created = PrintingInventory.objects.get_or_create(
                    paper_type=paper_type,
                    defaults={'onHand': 0, 'status': 'Out-of-Stock'}
               )

               # Subtract the total pages from onHand and update the inventory status
               inventory.onHand = max(0, inventory.onHand - total_pages)
               inventory.save()

          elif bill.lamination_request:
               lamination_request_details = bill.lamination_request.lamination_request_details
               page_count = bill.lamination_request.page_count
               quantity = lamination_request_details.quantity
               paper_type = lamination_request_details.paper_type
               total_pages = page_count * quantity

               # Retrieve or create the inventory for the paper type
               inventory, created = PrintingInventory.objects.get_or_create(
                    paper_type=paper_type,
                    defaults={'onHand': 0, 'status': 'Out-of-Stock'}
               )

               # Subtract the total pages from onHand and update the inventory status
               inventory.onHand = max(0, inventory.onHand - total_pages)
               inventory.save()

          return bill    

# class JobOrderSerializer(serializers.ModelSerializer):
#     # Use SerializerMethodField to conditionally display either print or book bind request details
    
#     request_details = serializers.SerializerMethodField()
#     unitcost = serializers.SerializerMethodField()
#     totalcost = serializers.SerializerMethodField()

#     class Meta:
#         model = JobOrder
#         fields = "__all__"

#     def get_request_details(self, obj):
#         # Check if the Bill has a PersonnelPrintRequest or BookBindingPersonnelRequest
#         if obj.request:
#             return DisplayPersonnelPrintRequestSerializer(obj.request).data
#         elif obj.book_bind_request:
#             return DisplayBookBindPersonnelRequestSerializer(obj.book_bind_request).data
#         elif obj.lamination_request:
#             return DisplayLaminationPersonnelRequestSerializer(obj.lamination_request).data
#         return None  # Return None if neither request type is available

#     def get_unitcost(self, obj):
#         # Check if it's a print request or a book bind request and calculate unit cost accordingly
#         if obj.request:
#             print_request_details = obj.request.print_request_details
#             base_price = print_request_details.paper_type.price
#             return base_price * 1.2 if print_request_details.duplex else base_price
#         elif obj.book_bind_request:
#             book_binding_request_details = obj.book_bind_request.book_binding_request_details
#             return book_binding_request_details.paper_type.price
#         elif obj.lamination_request:
#              lamination_request_details = obj.lamination_request.lamination_request_details
#              return lamination_request_details.paper_type.price
#         return 0  # Default unit cost if neither request type is available

#     def get_totalcost(self, obj):
#         # Calculate total cost based on request details
#         unitcost = self.get_unitcost(obj)

#         if obj.request:
#             print_request_details = obj.request.print_request_details
#             quantity = print_request_details.quantity
#             page_count = obj.request.page_count
#             total_pages = page_count * quantity
#             return total_pages * unitcost
        
#         elif obj.book_bind_request:
#             book_binding_request_details = obj.book_bind_request.book_binding_request_details
#             price = book_binding_request_details.request_type.price
#             page_count = obj.book_bind_request.page_count
#             quantity = book_binding_request_details.quantity
#             total_pages = page_count * quantity
            
#             return price + total_pages * unitcost
     
#         elif obj.lamination_request:
#              lamination_request_details = obj.lamination_request.lamination_request_details
#              price = lamination_request_details.request_type.price
#              page_count = obj.lamination_request.page_count
#              quantity = lamination_request_details.quantity
#              total_pages = page_count * quantity

#              return price + total_pages * unitcost
        
#         return 0  # Default total cost if neither request type is available

#     def create(self, validated_data):
#         # Create the Bill instance
#         joborder = super().create(validated_data)

#         # Handle inventory deduction based on the type of request (print or book bind)
#         if joborder.request:
#             print_request_details = joborder.request.print_request_details
#             paper_type = print_request_details.paper_type
#             quantity = print_request_details.quantity
#             page_count = joborder.request.page_count
#             total_pages = page_count * quantity

#             # Retrieve or create the inventory for the paper type
#             inventory, created = PrintingInventory.objects.get_or_create(
#                 paper_type=paper_type,
#                 defaults={'onHand': 0, 'status': 'Out-of-Stock'}
#             )

#             # Subtract the total pages from onHand and update the inventory status
#             inventory.onHand = max(0, inventory.onHand - total_pages)
#             inventory.save()

#         elif joborder.book_bind_request:
#             book_binding_request_details = joborder.book_bind_request.book_binding_request_details
#             quantity = book_binding_request_details.quantity
#             paper_type = book_binding_request_details.paper_type
#             page_count = joborder.book_bind_request.page_count
#             total_pages = page_count * quantity

#             # Retrieve or create the inventory for the paper type
#             inventory, created = PrintingInventory.objects.get_or_create(
#                 paper_type=paper_type,
#                 defaults={'onHand': 0, 'status': 'Out-of-Stock'}
#             )

#             # Subtract the total pages from onHand and update the inventory status
#             inventory.onHand = max(0, inventory.onHand - total_pages)
#             inventory.save()

#         elif joborder.lamination_request:
#              lamination_request_details = joborder.lamination_request.lamination_request_details
#              page_count = joborder.lamination_request.page_count
#              quantity = lamination_request_details.quantity
#              paper_type = lamination_request_details.paper_type
#              total_pages = page_count * quantity
                     
#              inventory, created = PrintingInventory.objects.get_or_create(
#                 paper_type=paper_type,
#                 defaults={'onHand': 0, 'status': 'Out-of-Stock'}
#             ) 
             
#              inventory.onHand = max(0, inventory.onHand - total_pages)
#              inventory.save()

#         return joborder
          

# class DisplayJobOrderSerializer(serializers.ModelSerializer):
#     # Use SerializerMethodField to conditionally display either print or book bind request details

#     request_details = serializers.SerializerMethodField()
#     unitcost = serializers.SerializerMethodField()
#     totalcost = serializers.SerializerMethodField()

#     class Meta:
#         model = JobOrder
#         fields = "__all__"

#     def get_request_details(self, obj):
#         # Check if the Bill has a PersonnelPrintRequest or BookBindingPersonnelRequest
#         if obj.request:
#             return DisplayPersonnelPrintRequestSerializer(obj.request).data
#         elif obj.book_bind_request:
#             return DisplayBookBindPersonnelRequestSerializer(obj.book_bind_request).data
#         elif obj.lamination_request:
#              return DisplayLaminationStudentRequestSerializer(obj.lamination_request).data 
#         return None  # Return None if neither request type is available

#     def get_unitcost(self, obj):
#         # Check if it's a print request or a book bind request and calculate unit cost accordingly
#         if obj.request:
#             print_request_details = obj.request.print_request_details
#             base_price = print_request_details.paper_type.price
#             return base_price * 1.2 if print_request_details.duplex else base_price
        
#         elif obj.book_bind_request:
#             book_binding_request_details = obj.book_bind_request.book_binding_request_details
#             return book_binding_request_details.paper_type.price
        
#         elif obj.lamination_request:
#              lamination_request_details = obj.lamination_request.lamination_request_details
#              return lamination_request_details.paper_type.price
#         return 0  # Default unit cost if neither request type is available

#     def get_totalcost(self, obj):
#         # Calculate total cost based on request details
#         unitcost = self.get_unitcost(obj)

#         if obj.request:
#             print_request_details = obj.request.print_request_details
#             quantity = print_request_details.quantity
#             page_count = obj.request.page_count
#             total_pages = page_count * quantity

#             return total_pages * unitcost
        
#         elif obj.book_bind_request:
#             book_binding_request_details = obj.book_bind_request.book_binding_request_details
#             price = book_binding_request_details.request_type.price
#             page_count = obj.book_bind_request.page_count
#             quantity = book_binding_request_details.quantity
#             total_pages = page_count * quantity
            
#             return price + total_pages * unitcost
        
#         elif obj.lamination_request:
#              lamination_request_details = obj.lamination_request.lamination_request_details
#              price = lamination_request_details.request_type.price
#              page_count = obj.lamination_request.page_count
#              quantity = lamination_request_details.quantity
#              total_pages = page_count * quantity

#              return price + total_pages * unitcost
        
#         return 0  # Default total cost if neither request type is available

#     def create(self, validated_data):
#         # Create the Bill instance
#         joborder = super().create(validated_data)

#         # Handle inventory deduction based on the type of request (print or book bind)
#         if joborder.request:
#             print_request_details = joborder.request.print_request_details
#             paper_type = print_request_details.paper_type
#             quantity = print_request_details.quantity
#             page_count = joborder.request.page_count
#             total_pages = page_count * quantity

#             # Retrieve or create the inventory for the paper type
#             inventory, created = PrintingInventory.objects.get_or_create(
#                 paper_type=paper_type,
#                 defaults={'onHand': 0, 'status': 'Out-of-Stock'}
#             )

#             # Subtract the total pages from onHand and update the inventory status
#             inventory.onHand = max(0, inventory.onHand - total_pages)
#             inventory.save()

#         elif joborder.book_bind_request:
#             book_binding_request_details = joborder.book_bind_request.book_binding_request_details
#             quantity = book_binding_request_details.quantity
#             paper_type = book_binding_request_details.paper_type
#             page_count = joborder.book_bind_request.page_count
#             total_pages = page_count * quantity
            

#             # Retrieve or create the inventory for the paper type
#             inventory, created = PrintingInventory.objects.get_or_create(
#                 paper_type=paper_type,
#                 defaults={'onHand': 0, 'status': 'Out-of-Stock'}
#             )

#             # Subtract the total pages from onHand and update the inventory status
#             inventory.onHand = max(0, inventory.onHand - total_pages)
#             inventory.save()

#         elif joborder.lamination_request:
#              lamination_request_details = joborder.lamination_request.lamination_request_details
#              page_count = joborder.lamination_request.page_count
#              quantity = lamination_request_details.quantity
#              paper_type = lamination_request_details.paper_type
#              total_pages = page_count * quantity
                     
#              inventory, created = PrintingInventory.objects.get_or_create(
#                 paper_type=paper_type,
#                 defaults={'onHand': 0, 'status': 'Out-of-Stock'}
#             ) 
             
#              inventory.onHand = max(0, inventory.onHand - total_pages)
#              inventory.save()

#         return joborder

class PaymentSlipSerializer(serializers.ModelSerializer):
    unitcost = serializers.SerializerMethodField()
    totalcost = serializers.SerializerMethodField()
    request_details = serializers.SerializerMethodField()

    class Meta:
        model = PaymentSlip
        fields = "__all__"


    def get_request_details(self, obj):
        # Check if the Bill has a PersonnelPrintRequest or BookBindingPersonnelRequest
        if obj.request:
            return DisplayPersonnelPrintRequestSerializer(obj.request).data
        elif obj.book_bind_request:
            return DisplayBookBindPersonnelRequestSerializer(obj.book_bind_request).data
        elif obj.lamination_request:
             return DisplayLaminationStudentRequestSerializer(obj.lamination_request).data 
        return None  # Return None if neither request type is available
        
    def get_unitcost(self, obj):
        """Calculate unit cost based on the context (printing or book-binding)."""
        if obj.request:  # Printing context
            print_request_details = obj.request.print_request_details
            base_price = print_request_details.paper_type.price
            return round(base_price, 2)
        elif obj.book_bind_request:  # Book-binding context
            book_binding_details = obj.book_bind_request.book_binding_request_details
            return book_binding_details.paper_type.price
        elif obj.lamination_request:
             lamination_request_details = obj.lamination_request.lamination_request_details
             return lamination_request_details.paper_type.price
        
        return 0  # Default in case no context is provided

    def get_totalcost(self, obj):
        """Calculate total cost based on the context."""
        unitcost = self.get_unitcost(obj)
        if obj.request:  # Printing context
            print_request_details = obj.request.print_request_details
            quantity = print_request_details.quantity
            page_count = obj.request.page_count
            total_pages = page_count * quantity
            return round(total_pages * unitcost, 2)
        elif obj.book_bind_request:  # Book-binding context
            book_binding_request_details = obj.book_bind_request.book_binding_request_details
            price = book_binding_request_details.request_type.price
            page_count = obj.book_bind_request.page_count
            quantity = book_binding_request_details.quantity
            total_pages = page_count * quantity
            
            return price + total_pages * unitcost
        
        elif obj.lamination_request:
             lamination_request_details = obj.lamination_request.lamination_request_details
             price = lamination_request_details.request_type.price
             page_count = obj.lamination_request.page_count
             quantity = lamination_request_details.quantity
             total_pages = page_count * quantity

             return price + total_pages * unitcost
        return 0  # Default in case no context is provided

    def update(self, instance, validated_data):
        current_status = instance.paid_status
        paymentslip = super().update(instance, validated_data)

        if current_status != 'Paid' and paymentslip.paid_status == 'Paid':
            if paymentslip.request:
                print_request_details = paymentslip.request.print_request_details
                paper_type = print_request_details.paper_type
                quantity = print_request_details.quantity
                page_count = paymentslip.request.page_count

                # Adjust total_pages for duplex
                if print_request_details.duplex:
                    total_pages = (page_count * quantity) / 2
                else:
                    total_pages = page_count * quantity

            elif paymentslip.book_bind_request:
                book_binding_details = paymentslip.book_bind_request.book_binding_request_details
                paper_type = book_binding_details.paper_type
                page_count = paymentslip.book_bind_request.page_count
                quantity = book_binding_details.quantity
                total_pages = page_count * quantity

            elif paymentslip.lamination_request:
                lamination_details = paymentslip.lamination_request.lamination_request_details
                quantity = lamination_details.quantity
                paper_type = lamination_details.paper_type
                page_count = paymentslip.lamination_request.page_count
                total_pages = page_count * quantity

            else:
                return paymentslip

            inventory, created = PrintingInventory.objects.get_or_create(
                paper_type=paper_type,
                defaults={'onHand': 0, 'status': 'Out-of-Stock'}
            )
            inventory.onHand = max(0, inventory.onHand - math.ceil(total_pages))
            inventory.save()

        return paymentslip

class DisplayPaymentSlipSerializer(serializers.ModelSerializer):
    request = DisplayStudentFormSerializer()
    book_bind_request = DisplayBookBindStudentRequestSerializer()
    lamination_request = DisplayLaminationStudentRequestSerializer()
    unitcost = serializers.SerializerMethodField()
    totalcost = serializers.SerializerMethodField()
    request_details = serializers.SerializerMethodField()

    class Meta:
        model = PaymentSlip
        fields = "__all__"

    def get_request_details(self, obj):
        # Check if the Bill has a PersonnelPrintRequest or BookBindingPersonnelRequest
        if obj.request:
            return DisplayPersonnelPrintRequestSerializer(obj.request).data
        elif obj.book_bind_request:
            return DisplayBookBindPersonnelRequestSerializer(obj.book_bind_request).data
        elif obj.lamination_request:
             return DisplayLaminationStudentRequestSerializer(obj.lamination_request).data 
        return None  # Return None if neither request type is available

    def get_unitcost(self, obj):
        """Calculate unit cost based on the context (printing or book-binding)."""
        if obj.request:  # Printing context
            print_request_details = obj.request.print_request_details
            base_price = print_request_details.paper_type.price
            return round(base_price, 2)
        elif obj.book_bind_request:  # Book-binding context
            book_binding_details = obj.book_bind_request.book_binding_request_details
            return book_binding_details.paper_type.price
        elif obj.lamination_request:
             lamination_request_details = obj.lamination_request.lamination_request_details
             return lamination_request_details.paper_type.price
        
        return 0  # Default in case no context is provided

    def get_totalcost(self, obj):
        """Calculate total cost based on the context."""
        unitcost = self.get_unitcost(obj)
        if obj.request:  # Printing context
            print_request_details = obj.request.print_request_details
            quantity = print_request_details.quantity
            page_count = obj.request.page_count
            total_pages = page_count * quantity
            return round(total_pages * unitcost, 2)
        elif obj.book_bind_request:  # Book-binding context
            book_binding_request_details = obj.book_bind_request.book_binding_request_details
            price = book_binding_request_details.request_type.price
            page_count = obj.book_bind_request.page_count
            quantity = book_binding_request_details.quantity
            total_pages = page_count * quantity
            
            return price + total_pages * unitcost
        elif obj.lamination_request:
             lamination_request_details = obj.lamination_request.lamination_request_details
             price = lamination_request_details.request_type.price
             page_count = obj.lamination_request.page_count
             quantity = lamination_request_details.quantity
             total_pages = page_count * quantity

             return price + total_pages * unitcost
        
        return 0  # Default in case no context is provided

    def update(self, instance, validated_data):
        current_status = instance.paid_status
        paymentslip = super().update(instance, validated_data)

        if current_status != 'Paid' and paymentslip.paid_status == 'Paid':
            if paymentslip.request:
                print_request_details = paymentslip.request.print_request_details
                paper_type = print_request_details.paper_type
                quantity = print_request_details.quantity
                page_count = paymentslip.request.page_count

                # Adjust total_pages for duplex
                if print_request_details.duplex:
                    total_pages = (page_count * quantity) / 2
                else:
                    total_pages = page_count * quantity

            elif paymentslip.book_bind_request:
                book_binding_details = paymentslip.book_bind_request.book_binding_request_details
                paper_type = book_binding_details.paper_type
                page_count = paymentslip.book_bind_request.page_count
                quantity = book_binding_details.quantity
                total_pages = page_count * quantity

            elif paymentslip.lamination_request:
                lamination_details = paymentslip.lamination_request.lamination_request_details
                quantity = lamination_details.quantity
                paper_type = lamination_details.paper_type
                page_count = paymentslip.lamination_request.page_count
                total_pages = page_count * quantity

            else:
                return paymentslip

            inventory, created = PrintingInventory.objects.get_or_create(
                paper_type=paper_type,
                defaults={'onHand': 0, 'status': 'Out-of-Stock'}
            )
            inventory.onHand = max(0, inventory.onHand - math.ceil(total_pages))
            inventory.save()

        return paymentslip

    

class FileSerializers(serializers.ModelSerializer):
     class Meta:
          model = FileUpload 
          fields = "__all__"



class StudentQueueDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentQueueDetails
        fields = "__all__"

     
class DisplayStudentQueueSerializer(serializers.ModelSerializer):
     student_print_request = DisplayPaymentSlipSerializer(read_only=True)
     

     class Meta:
          model = StudentQueueDetails
          fields = "__all__"
     

class BookBindStudentQueueSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookBindStudentQueue
        fields = "__all__"

class DisplayBookBindStudentQueueSerializer(serializers.ModelSerializer):
     book_bind_student_request = DisplayPaymentSlipSerializer(read_only=True)
     class Meta:
          model = BookBindStudentQueue
          fields = "__all__"

class LaminationStudentQueueSerializer(serializers.ModelSerializer):
     class Meta:
          model = LaminationStudentQueue
          fields = "__all__"  

class DisplayLaminationStudentQueueSerializer(serializers.ModelSerializer):
     lamination_student_request = DisplayPaymentSlipSerializer(read_only=True)
     class Meta:
          model = LaminationStudentQueue
          fields = "__all__"




## INVENTORY SERIALIZER ##

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = [
            'id', 'name', 'category', 'paper_type', 'stock_number', 
            'unit', 'unit_value', 'balance_per_card', 'total_value', 'onhand_per_count'
        ]

class RawMaterialsInventorySerializer(serializers.ModelSerializer):
    inventory_item_name = serializers.CharField(source='inventory_item.name', read_only=True)
    inventory_item_details = InventoryItemSerializer(source='inventory_item', read_only=True)

    class Meta:
        model = RawMaterialsInventory
        fields = ['id', 'inventory_item', 'inventory_item_name', 'inventory_item_details', 'stock_quantity']

class WorkInProcessInventorySerializer(serializers.ModelSerializer):
    inventory_item_name = serializers.CharField(source='inventory_item.name', read_only=True)
    inventory_item_details = InventoryItemSerializer(source='inventory_item', read_only=True)

    class Meta:
        model = WorkInProcessInventory
        fields = ['id', 'inventory_item', 'inventory_item_name', 'inventory_item_details', 'stock_quantity']


class StockCardSerializer(serializers.ModelSerializer):
    printing_inventory = DisplayPrintInventorySerializer(read_only=True)
    class Meta:
        model = StockCard
        fields = "__all__"

    def create(self, validated_data):
        """Handles stock transactions and ensures stock card values are in reams."""
        printing_inventory = validated_data["printing_inventory"]
        quantity_issued_sheets = validated_data.get("quantity_issued", 0) or 0
        quantity_received_sheets = validated_data.get("quantity_received", 0) or 0
        remarks = validated_data.get("remarks", "")

        SHEETS_PER_REAM = 500  # Adjust based on your standard

        # ✅ Convert all values from sheets to reams
        quantity_issued = quantity_issued_sheets / SHEETS_PER_REAM
        quantity_received = quantity_received_sheets / SHEETS_PER_REAM

        # ✅ Get the last stock card entry (stored in reams)
        last_stock = StockCard.objects.filter(printing_inventory=printing_inventory).order_by('-issued').first()

        if last_stock:
            prev_on_hand_reams = last_stock.quantity_on_hand  # Already in reams
            new_quantity_on_hand = prev_on_hand_reams - quantity_issued + quantity_received
        else:
            # ✅ First stock entry (convert `onHand` sheets to reams)
            new_quantity_on_hand = (printing_inventory.onHand / SHEETS_PER_REAM) if printing_inventory.onHand else 0
            quantity_issued = 0
            quantity_received = 0
            remarks = "Initial stock entry"

        # ✅ Set receiver
        receiver = "Roy M." if quantity_issued else "Supply" if quantity_received else None

        # ✅ Create stock card entry with values in reams
        stock_card = StockCard.objects.create(
            printing_inventory=printing_inventory,
            issued=validated_data.get("issued"),
            receiver=receiver,
            quantity_issued=round(quantity_issued, 2),  # Stored in reams
            quantity_received=round(quantity_received, 2),
            quantity_on_hand=round(new_quantity_on_hand, 2),
            remarks=remarks,
        )

        return stock_card