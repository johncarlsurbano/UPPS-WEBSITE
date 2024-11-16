from rest_framework import serializers
from .models import *
import math


class UserSerializer(serializers.ModelSerializer):
    class Meta:
         model = User
         fields = "__all__" 



class StudentFormSerializer(serializers.ModelSerializer):
     class Meta:
          model = StudentPrintForm
          fields = "__all__"

class RequestFormSerializer(serializers.ModelSerializer):
     student_print_form = StudentFormSerializer(read_only=True)
     request_type_name = serializers.StringRelatedField()
     paper_size = serializers.StringRelatedField()


     class Meta:
          model = Request
          fields = "__all__"

class PaperTypeSerializer(serializers.ModelSerializer):
     
     class Meta:
          model = PaperType
          fields = "__all__"


class QueueSerializer(serializers.ModelSerializer):
     student_print_form = serializers.StringRelatedField()
     request_type_name = serializers.StringRelatedField()
     request = RequestFormSerializer(read_only=True)
     request_id = serializers.IntegerField(write_only=True)

     class Meta:
          model= Queue
          fields="__all__"

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


class GetUserSerializer(serializers.ModelSerializer):
     department = DepartmentSerializer(read_only=True)
     position = PositionSerializer(read_only=True)

     class Meta:
          model = User
          fields = "_all__"

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

     class Meta:
          model = PrintRequestDetails
          fields = "__all__"

class DisplayPersonnelPrintRequestSerializer(serializers.ModelSerializer):
     personnel_print_request = PersonnelPrintRequestSerializer(read_only=True)
     department = DepartmentSerializer(read_only=True)
     position = PositionSerializer(read_only=True)
     print_request_details = PrintRequestSerializer(read_only=True)
     print_request_details = DisplayPrintDetailsSerializer(read_only=True) 

     
     class Meta:
          model = PersonnelPrintRequest
          fields = "__all__"

class DisplayPendingRequestSerializer(serializers.ModelSerializer):
     personnel_print_request = PersonnelPrintRequestSerializer(read_only=True)
     department = DepartmentSerializer(read_only=True)
     position = PositionSerializer(read_only=True)
     print_request_details = PrintRequestSerializer(read_only=True)
     print_request_details = DisplayPrintDetailsSerializer(read_only=True) 

     class Meta:
          model = PersonnelPrintRequest
          fields = "__all__"


class DisplayPersonnelPrintRequestQueueSerializer(serializers.ModelSerializer):
     personnel_print_request = DisplayPersonnelPrintRequestSerializer(read_only=True)
     
     class Meta:
          model = QueueDetails
          fields = "__all__"



class FileSerializers(serializers.ModelSerializer):
     class Meta:
          model = FileUpload 
          fields = "__all__"




class BillSerializer(serializers.ModelSerializer):
    unitcost = serializers.SerializerMethodField()
    totalcost = serializers.SerializerMethodField()

    class Meta:
        model = Bill
        fields = '__all__'

    def get_unitcost(self, obj):
        print_request_details = obj.request.print_request_details
        base_price = print_request_details.paper_type.price
        return base_price * 1.2 if print_request_details.duplex else base_price

    def get_totalcost(self, obj):
        print_request_details = obj.request.print_request_details
        quantity = print_request_details.quantity
        unitcost = self.get_unitcost(obj)
        return round(quantity * unitcost, 2)

    def create(self, validated_data):
        # Create the Bill instance
        bill = super().create(validated_data)

        # Get the requested paper type and quantity from the bill details
        paper_type = bill.request.print_request_details.paper_type
        quantity = bill.request.print_request_details.quantity

        # Retrieve or create the inventory for the paper type
        inventory, created = PrintingInventory.objects.get_or_create(
            paper_type=paper_type,
            defaults={'onHand': 0, 'status': 'Out-of-Stock'}
        )

        # Subtract the quantity from onHand and update the inventory status
        inventory.onHand = max(0, inventory.onHand - quantity)
        inventory.save()  # Save will automatically update the status

        return bill

class DisplayBillRequestDetailsSerializer(serializers.ModelSerializer):
     request = DisplayPersonnelPrintRequestSerializer()
     unitcost = serializers.SerializerMethodField()
     totalcost = serializers.SerializerMethodField()

     class Meta:
          model = Bill
          fields = "__all__"

     def get_unitcost(self, obj):
        print_request_details = obj.request.print_request_details
        base_price = print_request_details.paper_type.price
        return round(base_price * 1.2 if print_request_details.duplex else base_price)

     def get_totalcost(self, obj):
        print_request_details = obj.request.print_request_details
        quantity = print_request_details.quantity
        unitcost = self.get_unitcost(obj)
        return round(quantity * unitcost, 2)

     def create(self, validated_data):
        # Create the Bill instance
        bill = super().create(validated_data)

        # Get the requested paper type and quantity from the bill details
        paper_type = bill.request.print_request_details.paper_type
        quantity = bill.request.print_request_details.quantity

        # Retrieve or create the inventory for the paper type
        inventory, created = PrintingInventory.objects.get_or_create(
            paper_type=paper_type,
            defaults={'onHand': 0, 'status': 'Out-of-Stock'}
        )

        # Subtract the quantity from onHand and update the inventory status
        inventory.onHand = max(0, inventory.onHand - quantity)
        inventory.save()  # Save will automatically update the status

        return bill

          
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
        # Adjust `onHand` quantity dynamically
        onHand_adjustment = validated_data.get('onHand', 0)
        instance.onHand += onHand_adjustment  # Adds or subtracts based on the value

        # Update the `price` in the related `PaperType` model if provided
        paper_type_data = validated_data.get('paper_type')
        if paper_type_data and 'price' in paper_type_data:
            instance.paper_type.price = paper_type_data['price']
            instance.paper_type.save()  # Save to persist the new price

        instance.save()  # Save the inventory instance to apply any changes
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
        
        # Create PrintingInventory instance with the associated PaperType
        printing_inventory = PrintingInventory.objects.create(paper_type=paper_type, **validated_data)
        return printing_inventory
        



class SignatoriesSerializer(serializers.ModelSerializer):
     class Meta:
          model = Signatories
          fields = "__all__"