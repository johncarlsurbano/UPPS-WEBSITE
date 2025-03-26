from rest_framework import serializers
from .models import *
import math
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.exceptions import ValidationError
import requests
from django.conf import settings
from decimal import Decimal

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

class InkTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = InkType
        fields = "__all__"

class TonerTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TonerType
        fields = "__all__"

class RingBinderTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RingBinderType
        fields = "__all__"

# class LaminationFilmSizeSerializer(serializers.ModelSerializer):
#     class Meta:
#     model = LaminationFilmSize
#     fields = "__all__"



class DepartmentSerializer(serializers.ModelSerializer):
     class Meta:
          model=Department
          fields= "__all__"

class PositionSerializer(serializers.ModelSerializer):
     class Meta:
          model=Position
          fields= "__all__"

class PrintRequestDetailsSerializer(serializers.ModelSerializer):
    paper_type_id = serializers.PrimaryKeyRelatedField(
        queryset=PaperType.objects.filter(
            inventoryitem__workinprocessinventory__isnull=False
        ).distinct(),
        required=True,
        write_only=True  # ✅ This is used for posting data
    )
    paper_type = serializers.SerializerMethodField()  # ✅ This is for GET requests (display only)

    class Meta:
        model = PrintRequestDetails
        fields = ["printing_type", "request_type", "paper_type_id", "paper_type", "duplex", "quantity"]

    def get_paper_type(self, obj):
        """Retrieve paper type name from WorkInProcessInventory"""
        if obj.work_in_process_inventory:
            inventory_item = obj.work_in_process_inventory.inventory_item
            if inventory_item and inventory_item.paper_type:
                return inventory_item.paper_type.id  # ✅ Return the paper type ID for display
        return None  

    def validate_paper_type_id(self, value):
        """Ensure the selected paper type exists in WorkInProcessInventory"""
        if not WorkInProcessInventory.objects.filter(inventory_item__paper_type=value).exists():
            raise serializers.ValidationError("Selected paper type is not available in Work In Process Inventory.")
        return value

    def create(self, validated_data):
        """Find a WorkInProcessInventory that matches the selected paper_type_id"""
        paper_type = validated_data.pop("paper_type_id", None)  # ✅ Get posted paper_type_id

        # Find a matching WorkInProcessInventory entry
        work_in_process_inventory = WorkInProcessInventory.objects.filter(
            inventory_item__paper_type=paper_type
        ).first()

        if not work_in_process_inventory:
            raise serializers.ValidationError({"paper_type_id": "No WorkInProcessInventory entry found for this paper type."})

        validated_data["work_in_process_inventory"] = work_in_process_inventory
        return super().create(validated_data)



     

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

class newAddInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PrintingInventory
        fields = '__all__'
    
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
    paper_type = serializers.PrimaryKeyRelatedField(
        queryset=PaperType.objects.filter(
            inventoryitem__workinprocessinventory__isnull=False
        ).distinct(),
        required=False,
        allow_null=True,
        write_only=True
    )
    ring_binder_type = serializers.PrimaryKeyRelatedField(
        queryset=RingBinderType.objects.filter(
            inventoryitem__workinprocessinventory__isnull=False
        ).distinct(),
        required=False,
        allow_null=True,
        write_only=True
    )
    paper_type_display = serializers.SerializerMethodField(read_only=True)
    ring_binder_type_display = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = BookBindingRequestDetails
        fields = [
            "id","book_bind_type", "request_type", "paper_type", "ring_binder_type",
            "paper_type_display", "ring_binder_type_display", "quantity"
        ]

    def get_paper_type_display(self, obj):
        """Retrieve the correct paper type from all related WorkInProcessInventory entries"""
        paper_types = obj.work_in_process_inventory.filter(
            inventory_item__paper_type__isnull=False
        ).values_list("inventory_item__paper_type", flat=True).distinct()

        return paper_types.first() if paper_types else None

    def get_ring_binder_type_display(self, obj):
        """Retrieve the correct ring binder type from all related WorkInProcessInventory entries"""
        ring_binder_types = obj.work_in_process_inventory.filter(
            inventory_item__ring_binder_type__isnull=False
        ).values_list("inventory_item__ring_binder_type", flat=True).distinct()

        return ring_binder_types.first() if ring_binder_types else None

    def create(self, validated_data):
        """Find separate WorkInProcessInventory items for paper_type and ring_binder_type"""
        paper_type = validated_data.pop("paper_type", None)
        ring_binder_type = validated_data.pop("ring_binder_type", None)

        work_in_process_inventory_list = []  # ✅ Store multiple inventory entries

        # ✅ Find inventory that matches paper_type
        if paper_type:
            paper_inventory = WorkInProcessInventory.objects.filter(inventory_item__paper_type=paper_type).first()
            if paper_inventory:
                work_in_process_inventory_list.append(paper_inventory)

        # ✅ Find inventory that matches ring_binder_type
        if ring_binder_type:
            ring_inventory = WorkInProcessInventory.objects.filter(inventory_item__ring_binder_type=ring_binder_type).first()
            if ring_inventory:
                work_in_process_inventory_list.append(ring_inventory)

        # ✅ If no inventory found, return an error
        if not work_in_process_inventory_list:
            raise serializers.ValidationError({
                "work_in_process_inventory": "No matching inventory found for the selected paper type and/or ring binder type."
            })

        # ✅ Create the BookBindingRequestDetails instance
        book_bind_request = super().create(validated_data)

        # ✅ Assign multiple WorkInProcessInventory items
        book_bind_request.work_in_process_inventory.set(work_in_process_inventory_list)
        return book_bind_request





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
    request_details = serializers.SerializerMethodField()
    unitcost = serializers.SerializerMethodField()
    totalcost = serializers.SerializerMethodField()

    class Meta:
        model = Bill
        fields = "__all__"

    def get_request_details(self, obj):
        """Retrieve appropriate request details"""
        if obj.request:
            return DisplayPersonnelPrintRequestSerializer(obj.request).data
        elif obj.book_bind_request:
            return DisplayBookBindPersonnelRequestSerializer(obj.book_bind_request).data
        elif obj.lamination_request:
            return DisplayLaminationPersonnelRequestSerializer(obj.lamination_request).data
        return None  

    def get_unitcost(self, obj):
        """Retrieve unit cost based on paper type price"""
        work_in_process_inventory = None

        if obj.request:
            work_in_process_inventory = getattr(obj.request.print_request_details, "work_in_process_inventory", None)
        elif obj.book_bind_request:
            work_in_process_inventory = getattr(obj.book_bind_request.book_binding_request_details, "work_in_process_inventory", None)
        elif obj.lamination_request:
            work_in_process_inventory = getattr(obj.lamination_request.lamination_request_details, "work_in_process_inventory", None)

        # ✅ Handle Many-to-Many case
        if hasattr(work_in_process_inventory, "all"):  
            for inventory in work_in_process_inventory.all():
                if inventory.inventory_item and inventory.inventory_item.paper_type:
                    return inventory.inventory_item.paper_type.price  # ✅ Return first valid price
        elif work_in_process_inventory:  
            if work_in_process_inventory.inventory_item and work_in_process_inventory.inventory_item.paper_type:
                return work_in_process_inventory.inventory_item.paper_type.price

        return 0  

    def get_totalcost(self, obj):
        """Calculate total cost based on request details"""
        unitcost = Decimal(self.get_unitcost(obj))  # ✅ Ensure unitcost is Decimal
        total_cost = Decimal(0)  # ✅ Initialize as Decimal

        if obj.request:
            details = obj.request.print_request_details
            page_count = obj.request.page_count
            quantity = details.quantity

            # ✅ Convert total_pages to Decimal before multiplication
            total_pages = Decimal(page_count * quantity) / Decimal(2) if details.duplex else Decimal(page_count * quantity)
            total_cost = total_pages * unitcost

        elif obj.book_bind_request:
            details = obj.book_bind_request.book_binding_request_details
            page_count = obj.book_bind_request.page_count
            quantity = details.quantity
            book_bind_type = details.book_bind_type.book_bind_type_name  
            request_type_price = Decimal(details.request_type.price)  # ✅ Ensure it's Decimal

            if book_bind_type == "Book Bind":
                total_cost = request_type_price * Decimal(quantity)  
            else:
                total_pages = Decimal(page_count * quantity)
                total_cost = (total_pages * unitcost) + (request_type_price * Decimal(quantity))

        elif obj.lamination_request:
            details = obj.lamination_request.lamination_request_details
            page_count = obj.lamination_request.page_count
            quantity = details.quantity
            total_pages = Decimal(page_count * quantity)
            total_cost = total_pages * unitcost

        return total_cost

    def create(self, validated_data):
        """Create the Bill instance and deduct inventory from WorkInProcessInventory"""
        bill = super().create(validated_data)

        work_in_process_inventory = None
        total_sheets_required = 0
        paper_type_id = None
        ring_binder_type_id = None

        if bill.request:
            details = bill.request.print_request_details
            work_in_process_inventory = details.work_in_process_inventory  # ✅ No `.all()`
            page_count = bill.request.page_count
            quantity = details.quantity

            # ✅ Calculate total sheets required
            total_sheets_required = (page_count * quantity) / 2 if details.duplex else page_count * quantity

            # ✅ Find the correct `paper_type`
            paper_type_id = (
                work_in_process_inventory.inventory_item.paper_type.id
                if work_in_process_inventory and work_in_process_inventory.inventory_item and work_in_process_inventory.inventory_item.paper_type
                else None
            )

            # ✅ Trigger FIFO Deduction if Paper Type Exists
            if paper_type_id and total_sheets_required > 0:
                print(f"🚀 Triggering FIFO Deduction: Paper Type ID={paper_type_id}, Quantity={total_sheets_required}")
                self.trigger_fifo_deduction(paper_type_id, None, total_sheets_required)  # ✅ Deduct paper


        elif bill.book_bind_request:
            details = bill.book_bind_request.book_binding_request_details
            work_in_process_inventory = details.work_in_process_inventory.all()
            page_count = bill.book_bind_request.page_count
            quantity = details.quantity
            book_bind_type = details.book_bind_type  
            request_type = details.request_type  

            # ✅ Calculate total sheets required **for Computer Book Bind**
            if book_bind_type.book_bind_type_name == "Computer Book Bind":
                total_sheets_required = page_count * quantity  # **Fix: Ensure it correctly assigns total sheets**

            # ✅ Find the correct `paper_type` and `ring_binder_type`
            paper_type_id = work_in_process_inventory.filter(
                inventory_item__paper_type__isnull=False
            ).values_list("inventory_item__paper_type", flat=True).first()

            ring_binder_type_id = work_in_process_inventory.filter(
                inventory_item__ring_binder_type__isnull=False
            ).values_list("inventory_item__ring_binder_type", flat=True).first()

            ring_binder_quantity = quantity  # ✅ Fix: Use correct quantity for ring binders


            # ✅ Deduction Conditions
            if book_bind_type.book_bind_type_name == "Book Bind":
                paper_type_id = None  

            if book_bind_type.book_bind_type_name == "Computer Book Bind" and request_type.request_type_name == "Ring Bound":
                # ✅ Deduct paper only once
                if paper_type_id:
                    self.trigger_fifo_deduction(paper_type_id, None, total_sheets_required)  # ✅ Only call once

                # ✅ Deduct ring binder only once
                if ring_binder_type_id:
                    self.trigger_fifo_deduction(None, ring_binder_type_id, quantity)

            elif book_bind_type.book_bind_type_name == "Computer Book Bind":
                self.trigger_fifo_deduction(paper_type_id, None, total_sheets_required)  
            elif request_type.request_type_name == "Ring Bound":
                self.trigger_fifo_deduction(None, ring_binder_type_id, ring_binder_quantity)  

        elif bill.lamination_request:
            details = bill.lamination_request.lamination_request_details
            work_in_process_inventory = details.work_in_process_inventory.all()
            page_count = bill.lamination_request.page_count
            quantity = details.quantity
            total_sheets_required = page_count * quantity  # ✅ Fix: Ensure sheets are counted

        print(f"🚀 FINAL FIFO Deduction: paper_type_id={paper_type_id}, ring_binder_type_id={ring_binder_type_id}, quantity={total_sheets_required}")

        return bill


    def trigger_fifo_deduction(self, paper_type_id=None, ring_binder_type_id=None, quantity=0):
        """Trigger FIFO stock deduction for paper and/or ring binder."""
        fifo_deduction_url = "http://127.0.0.1:8000/api/deduct/fifo/"
        print(f"⚡ FIFO Deduction Called: paper_type_id={paper_type_id}, ring_binder_type_id={ring_binder_type_id}, quantity={quantity}")

        if quantity <= 0:
            print("⚠ No deduction needed: Quantity is zero")
            return  

        payloads = []

        if paper_type_id:
            payloads.append({
                "paper_type_id": paper_type_id,
                "quantity": quantity
            })

        if ring_binder_type_id:
            payloads.append({
                "ring_binder_type_id": ring_binder_type_id,
                "quantity": quantity
            })

        print(f"🚀 Sending FIFO Deduction Request: {payloads}")

        for payload in payloads:
            try:
                response = requests.post(fifo_deduction_url, json=payload)
                response_data = response.json()

                if response.status_code != 200:
                    print(f"❌ FIFO Deduction Failed: {response_data}")
                    raise serializers.ValidationError({"error": response_data.get("error", "Failed to deduct stock")})
                else:
                    print(f"✅ FIFO Deduction Successful: {response_data}")

            except requests.RequestException as e:
                print(f"❌ Request Exception: {e}")
                raise serializers.ValidationError({"error": f"Failed to connect to FIFO Deduction API: {str(e)}"})

            
            





          

class DisplayBillRequestDetailsSerializer(serializers.ModelSerializer):
    # Use SerializerMethodField to conditionally display either print or book bind request details

    request_details = serializers.SerializerMethodField()
    unitcost = serializers.SerializerMethodField()
    totalcost = serializers.SerializerMethodField()

    class Meta:
        model = Bill
        fields = "__all__"

    def get_request_details(self, obj):
        """Retrieve appropriate request details"""
        if obj.request:
            return DisplayPersonnelPrintRequestSerializer(obj.request).data
        elif obj.book_bind_request:
            return DisplayBookBindPersonnelRequestSerializer(obj.book_bind_request).data
        elif obj.lamination_request:
            return DisplayLaminationPersonnelRequestSerializer(obj.lamination_request).data
        return None  

    def get_unitcost(self, obj):
        """Retrieve unit cost based on paper type price"""
        work_in_process_inventory = None

        if obj.request:
            work_in_process_inventory = getattr(obj.request.print_request_details, "work_in_process_inventory", None)
        elif obj.book_bind_request:
            work_in_process_inventory = getattr(obj.book_bind_request.book_binding_request_details, "work_in_process_inventory", None)
        elif obj.lamination_request:
            work_in_process_inventory = getattr(obj.lamination_request.lamination_request_details, "work_in_process_inventory", None)

        # ✅ Handle Many-to-Many case
        if hasattr(work_in_process_inventory, "all"):  
            for inventory in work_in_process_inventory.all():
                if inventory.inventory_item and inventory.inventory_item.paper_type:
                    return inventory.inventory_item.paper_type.price  # ✅ Return first valid price
        elif work_in_process_inventory:  
            if work_in_process_inventory.inventory_item and work_in_process_inventory.inventory_item.paper_type:
                return work_in_process_inventory.inventory_item.paper_type.price

        return 0  

    def get_totalcost(self, obj):
        """Calculate total cost based on request details"""
        unitcost = Decimal(self.get_unitcost(obj))  # ✅ Ensure unitcost is Decimal
        total_cost = Decimal(0)  # ✅ Initialize as Decimal

        if obj.request:
            details = obj.request.print_request_details
            page_count = obj.request.page_count
            quantity = details.quantity

            # ✅ Convert total_pages to Decimal before multiplication
            total_pages = Decimal(page_count * quantity) / Decimal(2) if details.duplex else Decimal(page_count * quantity)
            total_cost = total_pages * unitcost

        elif obj.book_bind_request:
            details = obj.book_bind_request.book_binding_request_details
            page_count = obj.book_bind_request.page_count
            quantity = details.quantity
            book_bind_type = details.book_bind_type.book_bind_type_name  
            request_type_price = Decimal(details.request_type.price)  # ✅ Ensure it's Decimal

            if book_bind_type == "Book Bind":
                total_cost = request_type_price * Decimal(quantity)  
            else:
                total_pages = Decimal(page_count * quantity)
                total_cost = (total_pages * unitcost) + (request_type_price * Decimal(quantity))

        elif obj.lamination_request:
            details = obj.lamination_request.lamination_request_details
            page_count = obj.lamination_request.page_count
            quantity = details.quantity
            total_pages = Decimal(page_count * quantity)
            total_cost = total_pages * unitcost

        return total_cost

    def create(self, validated_data):
        """Create the Bill instance and deduct inventory from WorkInProcessInventory"""
        bill = super().create(validated_data)

        work_in_process_inventory = None
        total_sheets_required = 0
        paper_type_id = None
        ring_binder_type_id = None

        if bill.request:
            details = bill.request.print_request_details
            work_in_process_inventory = details.work_in_process_inventory  # ✅ No `.all()`
            page_count = bill.request.page_count
            quantity = details.quantity

            # ✅ Calculate total sheets required
            total_sheets_required = (page_count * quantity) / 2 if details.duplex else page_count * quantity

            # ✅ Find the correct `paper_type`
            paper_type_id = (
                work_in_process_inventory.inventory_item.paper_type.id
                if work_in_process_inventory and work_in_process_inventory.inventory_item and work_in_process_inventory.inventory_item.paper_type
                else None
            )

            # ✅ Trigger FIFO Deduction if Paper Type Exists
            if paper_type_id and total_sheets_required > 0:
                print(f"🚀 Triggering FIFO Deduction: Paper Type ID={paper_type_id}, Quantity={total_sheets_required}")
                self.trigger_fifo_deduction(paper_type_id, None, total_sheets_required)  # ✅ Deduct paper


        elif bill.book_bind_request:
            details = bill.book_bind_request.book_binding_request_details
            work_in_process_inventory = details.work_in_process_inventory.all()
            page_count = bill.book_bind_request.page_count
            quantity = details.quantity
            book_bind_type = details.book_bind_type  
            request_type = details.request_type  

            # ✅ Calculate total sheets required **for Computer Book Bind**
            if book_bind_type.book_bind_type_name == "Computer Book Bind":
                total_sheets_required = page_count * quantity  # **Fix: Ensure it correctly assigns total sheets**

            # ✅ Find the correct `paper_type` and `ring_binder_type`
            paper_type_id = work_in_process_inventory.filter(
                inventory_item__paper_type__isnull=False
            ).values_list("inventory_item__paper_type", flat=True).first()

            ring_binder_type_id = work_in_process_inventory.filter(
                inventory_item__ring_binder_type__isnull=False
            ).values_list("inventory_item__ring_binder_type", flat=True).first()

            ring_binder_quantity = quantity  # ✅ Fix: Use correct quantity for ring binders


            # ✅ Deduction Conditions
            if book_bind_type.book_bind_type_name == "Book Bind":
                paper_type_id = None  

            if book_bind_type.book_bind_type_name == "Computer Book Bind" and request_type.request_type_name == "Ring Bound":
                # ✅ Deduct paper only once
                if paper_type_id:
                    self.trigger_fifo_deduction(paper_type_id, None, total_sheets_required)  # ✅ Only call once

                # ✅ Deduct ring binder only once
                if ring_binder_type_id:
                    self.trigger_fifo_deduction(None, ring_binder_type_id, quantity)

            elif book_bind_type.book_bind_type_name == "Computer Book Bind":
                self.trigger_fifo_deduction(paper_type_id, None, total_sheets_required)  
            elif request_type.request_type_name == "Ring Bound":
                self.trigger_fifo_deduction(None, ring_binder_type_id, ring_binder_quantity)  

        elif bill.lamination_request:
            details = bill.lamination_request.lamination_request_details
            work_in_process_inventory = details.work_in_process_inventory.all()
            page_count = bill.lamination_request.page_count
            quantity = details.quantity
            total_sheets_required = page_count * quantity  # ✅ Fix: Ensure sheets are counted

        print(f"🚀 FINAL FIFO Deduction: paper_type_id={paper_type_id}, ring_binder_type_id={ring_binder_type_id}, quantity={total_sheets_required}")

        return bill


    def trigger_fifo_deduction(self, paper_type_id=None, ring_binder_type_id=None, quantity=0):
        """Trigger FIFO stock deduction for paper and/or ring binder."""
        fifo_deduction_url = "http://127.0.0.1:8000/api/deduct/fifo/"
        print(f"⚡ FIFO Deduction Called: paper_type_id={paper_type_id}, ring_binder_type_id={ring_binder_type_id}, quantity={quantity}")

        if quantity <= 0:
            print("⚠ No deduction needed: Quantity is zero")
            return  

        payloads = []

        if paper_type_id:
            payloads.append({
                "paper_type_id": paper_type_id,
                "quantity": quantity
            })

        if ring_binder_type_id:
            payloads.append({
                "ring_binder_type_id": ring_binder_type_id,
                "quantity": quantity
            })

        print(f"🚀 Sending FIFO Deduction Request: {payloads}")

        for payload in payloads:
            try:
                response = requests.post(fifo_deduction_url, json=payload)
                response_data = response.json()

                if response.status_code != 200:
                    print(f"❌ FIFO Deduction Failed: {response_data}")
                    raise serializers.ValidationError({"error": response_data.get("error", "Failed to deduct stock")})
                else:
                    print(f"✅ FIFO Deduction Successful: {response_data}")

            except requests.RequestException as e:
                print(f"❌ Request Exception: {e}")
                raise serializers.ValidationError({"error": f"Failed to connect to FIFO Deduction API: {str(e)}"})
    

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
        """Retrieve appropriate request details"""
        if obj.request:
            return DisplayPersonnelPrintRequestSerializer(obj.request).data
        elif obj.book_bind_request:
            return DisplayBookBindPersonnelRequestSerializer(obj.book_bind_request).data
        elif obj.lamination_request:
            return DisplayLaminationStudentRequestSerializer(obj.lamination_request).data
        return None  

    def get_unitcost(self, obj):
        """Retrieve unit cost based on paper type price"""
        work_in_process_inventory = None

        if obj.request:
            work_in_process_inventory = getattr(obj.request.print_request_details, "work_in_process_inventory", None)
        elif obj.book_bind_request:
            work_in_process_inventory = getattr(obj.book_bind_request.book_binding_request_details, "work_in_process_inventory", None)
        elif obj.lamination_request:
            work_in_process_inventory = getattr(obj.lamination_request.lamination_request_details, "work_in_process_inventory", None)

        # ✅ Ensure `work_in_process_inventory` exists before accessing `inventory_item`
        if work_in_process_inventory and work_in_process_inventory.inventory_item and work_in_process_inventory.inventory_item.paper_type:
            return round(work_in_process_inventory.inventory_item.paper_type.price, 2)

        return 0  

    def get_totalcost(self, obj):
        """Calculate total cost based on request details"""
        unitcost = self.get_unitcost(obj)
        total_pages = 0

        if obj.request:
            details = obj.request.print_request_details
            page_count = obj.request.page_count
            quantity = details.quantity
            total_pages = (page_count * quantity) / 2 if details.duplex else page_count * quantity

        elif obj.book_bind_request:
            details = obj.book_bind_request.book_binding_request_details
            page_count = obj.book_bind_request.page_count
            quantity = details.quantity
            total_pages = page_count * quantity

        elif obj.lamination_request:
            details = obj.lamination_request.lamination_request_details
            page_count = obj.lamination_request.page_count
            quantity = details.quantity
            total_pages = page_count * quantity

        return round(total_pages * unitcost, 2)

    def update(self, instance, validated_data):
        current_status = instance.paid_status
        paymentslip = super().update(instance, validated_data)

        # ✅ If status changes to "Paid", trigger FIFO deduction
        if current_status != "Paid" and paymentslip.paid_status == "Paid":
            paper_type_id = None
            total_sheets_required = 0

            if paymentslip.request:
                details = paymentslip.request.print_request_details
                work_in_process_inventory = details.work_in_process_inventory
                page_count = paymentslip.request.page_count
                quantity = details.quantity

                # ✅ Adjust for duplex printing
                total_sheets_required = (page_count * quantity) / 2 if details.duplex else page_count * quantity

                if work_in_process_inventory and work_in_process_inventory.inventory_item.paper_type:
                    paper_type_id = work_in_process_inventory.inventory_item.paper_type.id

            elif paymentslip.book_bind_request:
                details = paymentslip.book_bind_request.book_binding_request_details
                work_in_process_inventory = details.work_in_process_inventory
                page_count = paymentslip.book_bind_request.page_count
                quantity = details.quantity
                total_sheets_required = page_count * quantity

                if work_in_process_inventory and work_in_process_inventory.inventory_item.paper_type:
                    paper_type_id = work_in_process_inventory.inventory_item.paper_type.id

            elif paymentslip.lamination_request:
                details = paymentslip.lamination_request.lamination_request_details
                work_in_process_inventory = details.work_in_process_inventory
                page_count = paymentslip.lamination_request.page_count
                quantity = details.quantity
                total_sheets_required = page_count * quantity

                if work_in_process_inventory and work_in_process_inventory.inventory_item.paper_type:
                    paper_type_id = work_in_process_inventory.inventory_item.paper_type.id

            # ✅ Trigger FIFO deduction if paper type is available
            if paper_type_id and total_sheets_required > 0:
                self.trigger_fifo_deduction(paper_type_id, total_sheets_required)

        return paymentslip

    def trigger_fifo_deduction(self, paper_type_id, quantity):
        """Trigger FIFO stock deduction via API call"""
        fifo_deduction_url = f"http://127.0.0.1:8000/api/deduct/fifo/"  # Update with actual API URL

        payload = {
            "paper_type_id": paper_type_id,
            "quantity": quantity
        }

        try:
            response = requests.post(fifo_deduction_url, json=payload)
            response_data = response.json()

            if response.status_code != 200:
                raise serializers.ValidationError({"error": response_data.get("error", "Failed to deduct stock")})

        except requests.RequestException as e:
            raise serializers.ValidationError({"error": f"Failed to connect to FIFO Deduction API: {str(e)}"})


class DisplayPaymentSlipSerializer(serializers.ModelSerializer):
    request = DisplayStudentFormSerializer(read_only=True)
    book_bind_request = DisplayBookBindStudentRequestSerializer(read_only=True)
    lamination_request = DisplayLaminationStudentRequestSerializer(read_only=True)
    unitcost = serializers.SerializerMethodField()
    totalcost = serializers.SerializerMethodField()
    request_details = serializers.SerializerMethodField()

    class Meta:
        model = PaymentSlip
        fields = "__all__"

    def get_request_details(self, obj):
        """Retrieve appropriate request details"""
        if obj.request:
            return DisplayPersonnelPrintRequestSerializer(obj.request).data
        elif obj.book_bind_request:
            return DisplayBookBindPersonnelRequestSerializer(obj.book_bind_request).data
        elif obj.lamination_request:
            return DisplayLaminationStudentRequestSerializer(obj.lamination_request).data
        return None  

    def get_unitcost(self, obj):
        """Retrieve unit cost based on paper type price"""
        work_in_process_inventory = None

        if obj.request:
            work_in_process_inventory = getattr(obj.request.print_request_details, "work_in_process_inventory", None)
        elif obj.book_bind_request:
            work_in_process_inventory = getattr(obj.book_bind_request.book_binding_request_details, "work_in_process_inventory", None)
        elif obj.lamination_request:
            work_in_process_inventory = getattr(obj.lamination_request.lamination_request_details, "work_in_process_inventory", None)

        # ✅ Ensure `work_in_process_inventory` exists before accessing `inventory_item`
        if work_in_process_inventory and work_in_process_inventory.inventory_item and work_in_process_inventory.inventory_item.paper_type:
            return round(work_in_process_inventory.inventory_item.paper_type.price, 2)

        return 0  

    def get_totalcost(self, obj):
        """Calculate total cost based on request details"""
        unitcost = self.get_unitcost(obj)
        total_pages = 0

        if obj.request:
            details = obj.request.print_request_details
            page_count = obj.request.page_count
            quantity = details.quantity
            total_pages = (page_count * quantity) / 2 if details.duplex else page_count * quantity

        elif obj.book_bind_request:
            details = obj.book_bind_request.book_binding_request_details
            page_count = obj.book_bind_request.page_count
            quantity = details.quantity
            total_pages = page_count * quantity

        elif obj.lamination_request:
            details = obj.lamination_request.lamination_request_details
            page_count = obj.lamination_request.page_count
            quantity = details.quantity
            total_pages = page_count * quantity

        return round(total_pages * unitcost, 2)

    def update(self, instance, validated_data):
        current_status = instance.paid_status
        paymentslip = super().update(instance, validated_data)

        # ✅ If status changes to "Paid", trigger FIFO deduction
        if current_status != "Paid" and paymentslip.paid_status == "Paid":
            paper_type_id = None
            total_sheets_required = 0

            if paymentslip.request:
                details = paymentslip.request.print_request_details
                work_in_process_inventory = details.work_in_process_inventory
                page_count = paymentslip.request.page_count
                quantity = details.quantity

                # ✅ Adjust for duplex printing
                total_sheets_required = (page_count * quantity) / 2 if details.duplex else page_count * quantity

                if work_in_process_inventory and work_in_process_inventory.inventory_item.paper_type:
                    paper_type_id = work_in_process_inventory.inventory_item.paper_type.id

            elif paymentslip.book_bind_request:
                details = paymentslip.book_bind_request.book_binding_request_details
                work_in_process_inventory = details.work_in_process_inventory
                page_count = paymentslip.book_bind_request.page_count
                quantity = details.quantity
                total_sheets_required = page_count * quantity

                if work_in_process_inventory and work_in_process_inventory.inventory_item.paper_type:
                    paper_type_id = work_in_process_inventory.inventory_item.paper_type.id

            elif paymentslip.lamination_request:
                details = paymentslip.lamination_request.lamination_request_details
                work_in_process_inventory = details.work_in_process_inventory
                page_count = paymentslip.lamination_request.page_count
                quantity = details.quantity
                total_sheets_required = page_count * quantity

                if work_in_process_inventory and work_in_process_inventory.inventory_item.paper_type:
                    paper_type_id = work_in_process_inventory.inventory_item.paper_type.id

            if paper_type_id and total_sheets_required > 0:
                self.trigger_fifo_deduction(paper_type_id, total_sheets_required)

        return paymentslip

    def trigger_fifo_deduction(self, paper_type_id, quantity):
    
        fifo_deduction_url = f"http://127.0.0.1:8000/api/deduct/fifo/"  

        payload = {
            "paper_type_id": paper_type_id,
            "quantity": quantity
        }

        try:
            response = requests.post(fifo_deduction_url, json=payload)
            response_data = response.json()

            if response.status_code != 200:
                raise serializers.ValidationError({"error": response_data.get("error", "Failed to deduct stock")})

        except requests.RequestException as e:
            raise serializers.ValidationError({"error": f"Failed to connect to FIFO Deduction API: {str(e)}"})

    

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
    stock_quantity = serializers.IntegerField(source="rawmaterialsinventory.stock_quantity", read_only=True)

    class Meta:
        model = InventoryItem
        fields = "__all__"

class DisplayPrintInventorySerializer(serializers.ModelSerializer):
     paper_type = PaperTypeSerializer(read_only=True)
     inventory_item = InventoryItemSerializer(read_only=True)
     class Meta:
          model = PrintingInventory
          fields = "__all__"



class RawMaterialsInventorySerializer(serializers.ModelSerializer):
    inventory_item_name = serializers.CharField(source='inventory_item.name', read_only=True)
    inventory_item_details = serializers.CharField(source='inventory_item.name', read_only=True)
    inventory_item = InventoryItemSerializer(read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = RawMaterialsInventory
        fields = ['id', 'inventory_item', 'inventory_item_name', 'inventory_item_details', 'stock_quantity', 'status']

    def get_status(self, obj):
        return self.calculate_status(obj.inventory_item.category, obj.inventory_item.balance_per_card)

    def calculate_status(self, category, balance_per_card):
        stock_levels = {
            'Paper': (0, 100),
            'Ink': (0, 3),
            'Binding': (0, 5),
            'Office Storage': (0, 2),
            'Laminating': (0, 2),
            'ID Card': (0, 50),
            'Battery': (0, 2),
            'Toner': (0, 3),
            'Film' : (0, 2),
        }
        
        if category in stock_levels:
            out_of_stock, low_stock = stock_levels[category]
            if balance_per_card == out_of_stock:
                return "Out Of Stock"
            elif balance_per_card < low_stock:
                return "Low Stock"
            else:
                return "In Stock"
        
        return "Unknown"


class WorkInProcessInventorySerializer(serializers.ModelSerializer):
    inventory_item_name = serializers.CharField(source='inventory_item.name', read_only=True)
    inventory_item = InventoryItemSerializer(read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = WorkInProcessInventory
        fields = ['id', 'inventory_item', 'inventory_item_name', 'balance_per_card', 'created_at', 'sheets_per_ream', 'status']

    def get_status(self, obj):
        return self.calculate_status(obj.inventory_item.category, obj.balance_per_card)

    def calculate_status(self, category, balance_per_card):
        stock_levels = {
            'Paper': (0, 100),
            'Ink': (0, 3),
            'Binding': (0, 5),
            'Office Storage': (0, 2),
            'Laminating': (0, 2),
            'ID Card': (0, 50),
            'Battery': (0, 2),
            'Toner': (0, 3),
            'Film' : (0, 2),
        }
        
        if category in stock_levels:
            out_of_stock, low_stock = stock_levels[category]
            if balance_per_card == out_of_stock:
                return "Out Of Stock"
            elif balance_per_card < low_stock:
                return "Low Stock"
            else:
                return "In Stock"
        
        return "Unknown"





class WorkInProcessFIFOSerializer(serializers.ModelSerializer):
    """Serializer for WorkInProcessFIFO entries."""
    work_in_process = serializers.SerializerMethodField()

    class Meta:
        model = WorkInProcessFIFO
        fields = ["id", "transferred_quantity", "created_at", "work_in_process", "transferred_count"]

    def get_work_in_process(self, obj):
        """Retrieve related WorkInProcessInventory details."""
        if obj.work_in_process:  # Ensure it's not None
            return WorkInProcessInventorySerializer(obj.work_in_process).data
        return None  # If no related record, return None




class StockCardSerializer(serializers.ModelSerializer):
    raw_materials_inventory = serializers.PrimaryKeyRelatedField(queryset=RawMaterialsInventory.objects.all())
    raw_materials_inventory = RawMaterialsInventorySerializer(read_only=True)

    class Meta:
        model = StockCard
        fields = "__all__"

    def create(self, validated_data):
        """Handles stock transactions and ensures stock card values are updated properly."""
        raw_materials_inventory = validated_data["raw_materials_inventory"]
        quantity_issued = validated_data.get("quantity_issued", 0) or 0
        quantity_received = validated_data.get("quantity_received", 0) or 0
        remarks = validated_data.get("remarks", "")

        # ✅ Get the last stock card entry
        last_stock = StockCard.objects.filter(raw_materials_inventory=raw_materials_inventory).order_by('-issued').first()

        if last_stock:
            prev_on_hand = last_stock.quantity_on_hand
            new_quantity_on_hand = prev_on_hand - quantity_issued + quantity_received
        else:
            # ✅ First stock entry
            new_quantity_on_hand = raw_materials_inventory.inventory_item.balance_per_card or 0
            quantity_issued = 0
            quantity_received = 0
            remarks = "Initial stock entry"

        # ✅ Set receiver
        receiver = "Roy M." if quantity_issued else "Supply" if quantity_received else None

        # ✅ Create stock card entry
        stock_card = StockCard.objects.create(
            raw_materials_inventory=raw_materials_inventory,
            issued=validated_data.get("issued"),
            receiver=receiver,
            quantity_issued=quantity_issued,
            quantity_received=quantity_received,
            quantity_on_hand=new_quantity_on_hand,
            remarks=remarks,
        )

        # ✅ Update balance_per_card in RawMaterialsInventory
        raw_materials_inventory.inventory_item.balance_per_card = new_quantity_on_hand
        raw_materials_inventory.save()

        return stock_card
    
class ReportOfSuppliesAndMaterialsIssuedSerializer(serializers.ModelSerializer):
    first_day = serializers.SerializerMethodField()
    last_day = serializers.SerializerMethodField()

    class Meta:
        model = ReportOfMaterialsAndMaterialsIssued
        fields = "__all__"  # Include all model fields
        extra_fields = ['first_day', 'last_day']  # Add computed fields

    def get_first_day(self, obj):
        return obj.first_day if hasattr(obj, 'first_day') else None

    def get_last_day(self, obj):
        return obj.last_day if hasattr(obj, 'last_day') else None

