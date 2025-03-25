from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializer import *
from rest_framework import generics
from django.core.mail import send_mail
from .message import generate_request_accepted_message
from .declinemessage import generate_decline_message
from rest_framework.views import APIView 
from .utils.email_utls import send_email
from rest_framework.exceptions import ValidationError
import random
from django.shortcuts import render
from django.db.models import Sum
from django.utils.timezone import now
from datetime import datetime, timedelta
from django.db import transaction
from django.shortcuts import get_object_or_404


@api_view(["GET"])
def available_paper_types(request):
    """Fetch unique paper types available in WorkInProcessInventory"""
    paper_types = PaperType.objects.filter(
        inventoryitem__workinprocessinventory__isnull=False
    ).distinct()

    return Response([{"id": pt.id, "paper_type": pt.paper_type} for pt in paper_types])

def validate_inventory(paper_type_id, total_pages_required):
    try:
        inventory_item = PrintingInventory.objects.get(paper_type_id=paper_type_id)
        if inventory_item.onHand < total_pages_required:
            raise ValidationError(
                  f"INSUFFICIENT STOCKS FOR '{inventory_item.paper_type.paper_type}'. CANNOT PROCEED TO REQUEST."
            )
    except PrintingInventory.DoesNotExist:
        raise ValidationError(f"Paper type with ID {paper_type_id} does not exist in inventory.")
# # Create your views here.
# @api_view(['GET'])
# def getUser(request):
#     users = User.objects.all()
#     serializedData = UserSerializer(users, many=True).data
#     return Response(serializedData)


# @api_view(['POST'])
# def createUser(request):
#     data = request.data
#     serializer = UserSerializer(data=data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST)

class UserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class LoginView(APIView):

    def post(self,request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        user_data = UserRequestSerializer(user).data

        return Response({
            'message': 'Login Successful!',
            'data': user_data
        })



    
class EmailView(APIView):
    def post(self, request):
        email = request.data.get('email') 
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"exists": True}, status=status.HTTP_200_OK)
        return Response({"exists": False}, status=status.HTTP_200_OK)
    
        
class SendRegistrationCodeView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Generate a 6-digit registration code
        code = random.randint(100000, 999999)
        message = f"Your registration code is: {code}"

        try:
            send_email(
                subject="Your Registration Code",
                message=message,
                from_email="universityprintingpresssystem@gmail.com",
                recipient_list=[email],
                host_user="universityprintingpresssystem@gmail.com",
                host_password="hzxt srtp utoo ejgo",
                fail_silently=False,
            )
        except Exception as e:
            print(f"Error: {e}")
            return Response(
                {"error": f"Failed to send email: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response({"message": "Registration code sent", "code": code}, status=status.HTTP_200_OK)
    
class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('password')
        

        try:
            user = User.objects.get(email=email)
            user.password = make_password(new_password)  # Hash the new password before saving
            user.save()
            return Response({'success': True, 'message': 'Password reset successfully.'}, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    

class GetUserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = GetUserSerializer

class UpdateUserStatusView(generics.RetrieveUpdateAPIView):

    queryset = User.objects.all()
    serializer_class = GetUserSerializer

    def get_queryset(self):
        
        pk = self.kwargs['pk']
        
        return User.objects.filter(
            id=pk,
        )
    
    def patch(self, request, *args, **kwargs):
        # Retrieve the instance to be updated
        instance = self.get_object()

        # Get the initial account status before the update
        old_status = instance.account_status

        # Perform the update using the serializer
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            # Save the updated instance
            instance = serializer.save()

            # Check the updated account_status
            updated_status = instance.account_status

            # Send email based on the updated status
            if updated_status != old_status:  # Only send an email if the status changed
                if updated_status == "Active":
                    subject = "Request Accepted by the Chairman"
                    message = f"Dear {instance.first_name},\n\nYour account has been accepted by the Chairman. You may now access the system.\n\nThank you."
                elif updated_status == "Denied":
                    subject = "Request Declined by the Chairman"
                    message = f"Dear {instance.first_name},\n\nWe regret to inform you that your account has been declined by the Chairman. Please contact the department for further assistance.\n\nThank you."

                # Send the email
                try:
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email="ustpchairman@gmail.com",
                        recipient_list=[instance.email],
                        fail_silently=False,
                    )
                except Exception as e:
                    return Response({"error": f"Email failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

class UpdateUserView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = GetUserSerializer


class StudentView(generics.ListCreateAPIView):
    queryset = StudentPrintForm.objects.all()
    serializer_class = StudentFormSerializer

    def create(self, request, *args, **kwargs):
        # Extract PDF file from request
        pdf_file = request.FILES.get("pdf")
        page_count = 0

        # ✅ Calculate the number of pages
        if pdf_file:
            try:
                reader = PdfReader(pdf_file)
                page_count = len(reader.pages)
            except Exception as e:
                return Response({"error": f"Failed to read PDF: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # If no PDF, get the page count manually from the input
            page_count = request.data.get("page_count")
            if not page_count or not str(page_count).isdigit():
                return Response({"error": "Manual page count is required and must be a positive integer when no PDF is provided."}, 
                                status=status.HTTP_400_BAD_REQUEST)
            page_count = int(page_count)

        # ✅ Retrieve print request details
        print_request_details_id = request.data.get("print_request_details")
        if not print_request_details_id:
            return Response({"error": "Print request details are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            print_request_details = PrintRequestDetails.objects.get(id=print_request_details_id)
        except PrintRequestDetails.DoesNotExist:
            return Response({"error": "Print request details not found."}, status=status.HTTP_404_NOT_FOUND)

        # ✅ Get paper type from WorkInProcessInventory
        work_in_process_inventory = print_request_details.work_in_process_inventory
        if not work_in_process_inventory:
            return Response({"error": "No WorkInProcessInventory linked to this request."}, status=status.HTTP_400_BAD_REQUEST)

        paper_type = work_in_process_inventory.inventory_item.paper_type
        if not paper_type:
            return Response({"error": "Paper type is missing in WorkInProcessInventory."}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Calculate total sheets required
        quantity = print_request_details.quantity
        total_sheets_required = (page_count * quantity) / 2 if print_request_details.duplex else page_count * quantity

        # ✅ Validate inventory based on `sheets_per_ream`
        if work_in_process_inventory.sheets_per_ream < total_sheets_required:
            return Response({"error": "INSUFFICIENT STOCKS"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Save the request (No stock deduction here)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request_instance = serializer.save(page_count=page_count)

        # ✅ Prepare the response
        headers = self.get_success_headers(serializer.data)
        response_data = serializer.data
        response_data["page_count"] = page_count  # Include page count in the response

        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)


class GetStudentView(generics.ListAPIView):
    queryset = StudentPrintForm.objects.all()
    serializer_class = DisplayStudentFormSerializer

class StudentDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StudentPrintForm.objects.all()
    serializer_class = StudentFormSerializer

class StudentQueue(generics.ListCreateAPIView):
    queryset = StudentQueueDetails.objects.all()
    serializer_class = StudentQueueDetailsSerializer

class DisplayStudentQueue(generics.ListAPIView):
    queryset = StudentQueueDetails.objects.all()
    serializer_class = DisplayStudentQueueSerializer

class UpdateStudentQueueStatusView(generics.RetrieveUpdateAPIView):
    queryset = StudentQueueDetails.objects.all()
    serializer_class = StudentQueueDetailsSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('queue_status', instance.queue_status)

        # Validate and update the queue_status field
        if new_status in ["Ready to Claim", "In Progress", "Pending"]:
            instance.queue_status = new_status
            instance.save()

            # If the status is updated to "Ready to Claim", send email
            if new_status == "Ready to Claim":
                student_request = instance.student_print_request
                user = student_request.request  # Get the related user
                email = user.email  # Get the user's email address
                duplex_value = "Yes" if student_request.request.print_request_details.duplex else "No"

                # Construct the email message
                subject = "Your Print Request is Ready to Claim"
                message = f"""Dear {student_request.request.first_name} {student_request.request.last_name},

                        We are pleased to inform you that your print request is now ready to claim. You can proceed to the printing office to collect your document.

                        Here are the details of your request:

                        - Customer Name: {student_request.request.first_name} {student_request.request.last_name}
                        - Department: {student_request.request.department.department_name}
                        - Request Type: {student_request.request.print_request_details.printing_type.printing_type_name}
                        - Paper Size: {student_request.request.print_request_details.paper_type.paper_type}
                        - Quantity: {student_request.request.print_request_details.quantity}
                        - Back to Back: {duplex_value}

                        Thank you for using our printing service.

                        Best regards,
                        The University Printing Press System
                        """
                from_email = "universityprintingpresssystem@gmail.com"

                # Send the email
                try:
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email=from_email,
                        recipient_list=[email],
                        auth_user="universityprintingpresssystem@gmail.com",
                        auth_password="hzxt srtp utoo ejgo",
                        fail_silently=False,
                    )
                except Exception as e:
                    return Response(
                        {"error": f"Failed to send email: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
        else:
            return Response({"error": "Invalid queue status"}, status=status.HTTP_400_BAD_REQUEST)

        
        # Return the updated instance data
        return Response(StudentQueueDetailsSerializer(instance).data)

class DeleteStudentReadyToClaimView(generics.DestroyAPIView):
    queryset = StudentQueueDetails.objects.all()
    serializer_class = StudentQueueDetailsSerializer


class PaymentSlipView(generics.ListCreateAPIView):
    queryset = PaymentSlip.objects.all()
    serializer_class = PaymentSlipSerializer

class DisplayPaymentSlipView(generics.ListAPIView):
    queryset = PaymentSlip.objects.all()
    serializer_class = DisplayPaymentSlipSerializer


class UpdatePaymentStatusSlipView(generics.RetrieveUpdateAPIView):
    queryset = PaymentSlip.objects.all()
    serializer_class = DisplayPaymentSlipSerializer


class SeriviceTypeView(generics.ListCreateAPIView):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer

class PaperTypeView(generics.ListCreateAPIView):
    queryset = PaperType.objects.all()
    serializer_class = PaperTypeSerializer

class InkTypeView(generics.ListCreateAPIView):
    queryset = InkType.objects.all()
    serializer_class = InkTypeSerializer

class TonerTypeView(generics.ListCreateAPIView):
    queryset = TonerType.objects.all()
    serializer_class = TonerTypeSerializer

class RingBinderTypeView(generics.ListCreateAPIView):
    queryset = RingBinderType.objects.all()
    serializer_class = RingBinderTypeSerializer

# class LaminationFilmSizeView(generics.ListCreateAPIView):
#     queryset = LaminationFilmSize.objects.all()
#     serializer_class = LaminationFilmSizeSerializer

class PaperTypeInventoryView(APIView):
    def get(self, request, paper_type):
        # Filter items based on paper type
        inventory_items = InventoryItem.objects.filter(paper_type__paper_type=paper_type)

        # Calculate the total reams (onhand_per_count)
        total_reams = inventory_items.aggregate(total_reams=Sum('balance_per_card'))['total_reams']

        # Serialize the inventory items
        serializer = InventoryItemSerializer(inventory_items, many=True)

        return Response({
            "paper_type": paper_type,
            "total_reams": total_reams if total_reams else 0,  # Default to 0 if no data
            "inventory_items": serializer.data
        })

class RequestTypeView(generics.ListCreateAPIView):
    queryset = RequestType.objects.all()
    serializer_class = RequestTypeSerializer

class PrintingTypeView(generics.ListCreateAPIView):
    queryset = PrintingType.objects.all()
    serializer_class = PrintingTypeSerializer

class DepartmentView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class PositionView(generics.ListCreateAPIView):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer

class PrintRequestDetailsView(generics.ListCreateAPIView):
    queryset = PrintRequestDetails.objects.all()
    serializer_class = PrintRequestDetailsSerializer



class PersonnelPrintRequestView(generics.ListCreateAPIView):
    queryset = PersonnelPrintRequest.objects.all()
    serializer_class = PersonnelPrintRequestSerializer




class RetrievePersonnelPrintRequestView(generics.ListCreateAPIView):
    queryset = PersonnelPrintRequest.objects.all()
    serializer_class = DisplayPersonnelPrintRequestSerializer

    def get_queryset(self):
        
        pk = self.kwargs['pk']
        
        return PersonnelPrintRequest.objects.filter(
            user_id=pk,
        )
    
class RetrieveAcceptedPersonnelPrintRequestView(generics.ListAPIView):
    queryset = PersonnelPrintRequest.objects.all()
    serializer_class = PersonnelPrintRequestSerializer

    def get_queryset(self):
        
        status = self.kwargs['status']
        
        return PersonnelPrintRequest.objects.filter(
           request_status=self.kwargs['status']
        )
    

class UpdateRequestView(generics.RetrieveUpdateAPIView):
    queryset = PersonnelPrintRequest.objects.all()
    serializer_class = DisplayPendingRequestSerializer

    def patch(self, request, *args, **kwargs):
        # Get the instance
        instance = self.get_object()

        # Update the request status
        instance.request_status = request.data.get('request_status', instance.request_status)
        instance.save()

        # Send email if the request is accepted
        if instance.request_status == "accepted":
            try:
                
                message = generate_request_accepted_message(instance)
                send_mail(
                    
                    subject="Request Accepted by the Chairman",
                    message=message,
                    from_email="ustpchairman@gmail.com",  # Replace with your email
                    recipient_list=[instance.user.email],   # Assumes `email` is a field in the model
                    fail_silently=False,
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to send email: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        elif instance.request_status == "declined":
            try:
        # Generate the decline message
                message = generate_decline_message(instance)
                send_mail(
                    subject="Request Declined by the Chairman",
                    message=message,
                    from_email="ustpchairman@gmail.com",  # Replace with your email
                    recipient_list=[instance.user.email],  # Assumes `email` is a field in the model
                    fail_silently=False,
                )
        
            except Exception as e:
                return Response(
                    {"error": f"Failed to send email: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        # Return the updated instance
        return Response(
            PersonnelPrintRequestSerializer(instance).data,
            status=status.HTTP_200_OK
        )
    

class QueueView(generics.ListCreateAPIView):
    queryset = QueueDetails.objects.all()
    serializer_class = QueueSerializer


    

class UpdateQueueView(generics.RetrieveUpdateAPIView):
    queryset = QueueDetails.objects.all()
    serializer_class = QueueSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('queue_status', instance.queue_status)

        # Validate and update the queue_status field
        if new_status in ["Ready to Claim", "In Progress", "Pending"]:
            instance.queue_status = new_status
            instance.save()

            # If the status is updated to "Ready to Claim", send email
            if new_status == "Ready to Claim":
                personnel_request = instance.personnel_print_request
                user = personnel_request.user  # Get the related user
                email = user.email  # Get the user's email address
                duplex_value = "Yes" if personnel_request.print_request_details.duplex else "No"

                # Construct the email message
                subject = "Your Print Request is Ready to Claim"
                message = f"""Dear {user.first_name} {user.last_name},

                            We are pleased to inform you that your print request is now ready to claim. You can proceed to the printing office to collect your document.

                            Here are the details of your request:

                            - Customer Name: {user.first_name} {user.last_name}
                            - Department: {user.department.department_name}
                            - Request Type: {personnel_request.print_request_details.printing_type.printing_type_name}
                            - Paper Size: {personnel_request.print_request_details.paper_type.paper_type}
                            - Quantity: {personnel_request.print_request_details.quantity}
                            - Back to Back: {duplex_value}

                            Thank you for using our printing service.

                            Best regards,  
                            The University Printing Press System
                            """
                from_email = "universityprintingpresssystem@gmail.com"

                # Send the email
                try:
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email=from_email,
                        recipient_list=[email],
                        auth_user="universityprintingpresssystem@gmail.com",
                        auth_password="hzxt srtp utoo ejgo",
                        fail_silently=False,
                    )
                except Exception as e:
                    return Response(
                        {"error": f"Failed to send email: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
        else:
            return Response({"error": "Invalid queue status"}, status=status.HTTP_400_BAD_REQUEST)

        # Return the updated instance data
        return Response(QueueSerializer(instance).data)


class CreateRequestView(generics.ListCreateAPIView):
    queryset = PersonnelPrintRequest.objects.all()
    serializer_class = CreateRequestSerializer

    def create(self, request, *args, **kwargs):
        # Extract PDF file from request
        pdf_file = request.FILES.get('pdf')
        page_count = 0

        # Calculate the number of pages
        if pdf_file:
            try:
                reader = PdfReader(pdf_file)
                page_count = len(reader.pages)
            except Exception as e:
                return Response({"error": f"Failed to read PDF: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # If no PDF, get the page count manually from the input
            page_count = request.data.get('page_count')
            if not page_count or not str(page_count).isdigit():
                return Response({"error": "Manual page count is required and must be a positive integer when no PDF is provided."}, 
                                status=status.HTTP_400_BAD_REQUEST)
            page_count = int(page_count)

        # ✅ Get `print_request_details`
        print_request_details_id = request.data.get("print_request_details")
        if not print_request_details_id:
            return Response({"error": "Print request details are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            print_request_details = PrintRequestDetails.objects.get(id=print_request_details_id)
        except PrintRequestDetails.DoesNotExist:
            return Response({"error": "Print request details not found."}, status=status.HTTP_404_NOT_FOUND)

        # ✅ Get `paper_type` through `WorkInProcessInventory`
        work_in_process_inventory = print_request_details.work_in_process_inventory
        if not work_in_process_inventory:
            return Response({"error": "No WorkInProcessInventory linked to this request."}, status=status.HTTP_400_BAD_REQUEST)

        paper_type = work_in_process_inventory.inventory_item.paper_type
        if not paper_type:
            return Response({"error": "Paper type is missing in WorkInProcessInventory."}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Extract quantity from PrintRequestDetails
        quantity = print_request_details.quantity

        # ✅ Calculate total sheets required
        total_sheets_required = page_count * quantity  # Now calculated in sheets

        # ✅ Validate inventory based on `sheets_per_ream`
        if work_in_process_inventory.sheets_per_ream < total_sheets_required:
            return Response({"error": "INSUFFICIENT STOCKS"}, status=status.HTTP_400_BAD_REQUEST)


        # ✅ Save the request
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request_instance = serializer.save(page_count=page_count)

        # ✅ Prepare the response
        headers = self.get_success_headers(serializer.data)
        response_data = serializer.data
        response_data["page_count"] = page_count  # Include page count in the response
        response_data["file_url"] = request.build_absolute_uri(response_data["pdf"])

        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)


    


class RetrieveReadyToClaimView(generics.ListAPIView):
    queryset = QueueDetails.objects.all()
    serializer_class = QueueSerializer

    def get_queryset(self):
        return QueueDetails.objects.filter(queue_status="Ready to Claim")
    
class DeleteReadyToClaimView(generics.DestroyAPIView):
    queryset = QueueDetails.objects.all()
    serializer_class = QueueSerializer

class DisplayPersonnelRequest(generics.ListAPIView):
    queryset = PersonnelPrintRequest.objects.all()
    serializer_class = DisplayPersonnelPrintRequestSerializer

class DisplayPersonnelPrintQueueRequest(generics.ListAPIView):
    queryset = QueueDetails.objects.all()
    serializer_class = DisplayPersonnelPrintRequestQueueSerializer

class DisplayPendingRequestView(generics.ListAPIView):
    queryset = PersonnelPrintRequest.objects.all()
    serializer_class = DisplayPendingRequestSerializer

    def get_queryset(self):
        status = self.kwargs.get('status', None)

        if status:
            return PersonnelPrintRequest.objects.filter(request_status=status)
        else:
            return PersonnelPrintRequest.objects.none()
        
class EditRequestView(generics.UpdateAPIView):
    queryset = QueueDetails.objects.all()
    serializer_class = EditRequestSerializer


class BillView(generics.ListCreateAPIView):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer

# class JobOrderView(generics.ListCreateAPIView):
#     queryset = JobOrder.objects.all()
#     serializer_class = JobOrderSerializer

# class DisplayJobOrderView(generics.ListAPIView):
#     queryset = JobOrder.objects.all()
#     serializer_class = DisplayJobOrderSerializer

class PrintingInventoryView(generics.ListCreateAPIView):
    queryset = PrintingInventory.objects.all()
    serializer_class = DisplayPrintInventorySerializer

class InventoryAddReamView(generics.ListCreateAPIView):
    queryset = PrintingInventory.objects.all()
    serializer_class = AddItemPrintingSerializer

class UpdatePrintingInventoryView(generics.RetrieveUpdateAPIView):
    queryset = PrintingInventory.objects.all()
    serializer_class = UpdatePrintingInventorySerializer


    
class DisplayPrintDetailsView(generics.ListCreateAPIView):
    queryset = PrintRequestDetails.objects.all()
    serializer_class = DisplayPrintDetailsSerializer

class DisplayBillRequestView(generics.ListAPIView):
    queryset = Bill.objects.all()
    serializer_class = DisplayBillRequestDetailsSerializer

class DisplayPrintInventoryView(generics.ListAPIView):
    queryset = PrintingInventory.objects.all()
    serializer_class = DisplayPrintInventorySerializer

class updatePaidStatusView(generics.RetrieveUpdateAPIView):
    queryset = Bill.objects.all()
    serializer_class = DisplayBillRequestDetailsSerializer

class SignatoriesView(generics.ListCreateAPIView):
    queryset = Signatories.objects.all()
    serializer_class = SignatoriesSerializer

class CreatePrintingInventoryView(generics.ListCreateAPIView):
    queryset = PrintingInventory.objects.all()
    serializer_class = AddItemPrintingSerializer

class newCreateInventory(generics.ListCreateAPIView):
    queryset = PrintingInventory.objects.all()
    serializer_class = newAddInventorySerializer

class DeletePrintingInventoryView(generics.RetrieveDestroyAPIView):
    queryset = PrintingInventory.objects.all()
    serializer_class = AddItemPrintingSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Store the related paper type before deleting the inventory
        related_paper_type = instance.paper_type
        
        # Delete the inventory instance
        self.perform_destroy(instance)
        
        # Delete the related PaperType instance
        related_paper_type.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)




##################################################################################################
# BOOK BIND VIEWS 
##################################################################################################

class CreateBookBindType(generics.ListCreateAPIView):
    queryset = BookBindType.objects.all()
    serializer_class = TypeBookBindSerializer

class CreateBookBindRequestType(generics.ListCreateAPIView):
    queryset = BookBindRequestType.objects.all()
    serializer_class = BookBindRequestTypeSerializer

class CreateBookBindRequestDetailsView(generics.ListCreateAPIView):
    queryset = BookBindingRequestDetails.objects.all()
    serializer_class = BookBindRequestDetailsSerializer

class GetBookBindRequestDetailsView(generics.ListAPIView):
    queryset = BookBindingRequestDetails.objects.all()
    serializer_class = DisplayBookBindRequestDetailsSerializer

class CreateBookBindPersonnelRequestView(generics.ListCreateAPIView):
    queryset = BookBindingPersonnelRequest.objects.all()
    serializer_class = BookBindPersonnelRequestSerializer

    def create(self, request, *args, **kwargs):
        # Extract PDF file from request
        pdf_file = request.FILES.get("pdf")
        page_count = 0

        # ✅ Calculate the number of pages
        if pdf_file:
            try:
                reader = PdfReader(pdf_file)
                page_count = len(reader.pages)
            except Exception as e:
                return Response({"error": f"Failed to read PDF: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # If no PDF, get the page count manually from the input
            page_count = request.data.get("page_count")
            if not page_count or not str(page_count).isdigit():
                return Response({"error": "Manual page count is required and must be a positive integer when no PDF is provided."}, 
                                status=status.HTTP_400_BAD_REQUEST)
            page_count = int(page_count)

        # ✅ Retrieve book binding request details
        book_binding_request_details_id = request.data.get("book_binding_request_details")
        if not book_binding_request_details_id:
            return Response({"error": "Book binding request is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            book_binding_request_details = BookBindingRequestDetails.objects.get(id=book_binding_request_details_id)
        except BookBindingRequestDetails.DoesNotExist:
            return Response({"error": "Book binding details not found."}, status=status.HTTP_404_NOT_FOUND)

        # ✅ Get `book_bind_type`, `book_bind_request_type`, and `quantity`
        book_bind_type = book_binding_request_details.book_bind_type
        book_bind_request_type = book_binding_request_details.request_type
        work_in_process_inventory = book_binding_request_details.work_in_process_inventory.all()  # ✅ Fix: Get all inventory records
        quantity = book_binding_request_details.quantity

        # ✅ Find the correct `paper_type` and `ring_binder_type`
        paper_type = work_in_process_inventory.filter(inventory_item__paper_type__isnull=False).values_list("inventory_item__paper_type", flat=True).first()
        ring_binder_type = work_in_process_inventory.filter(inventory_item__ring_binder_type__isnull=False).values_list("inventory_item__ring_binder_type", flat=True).first()

        # ✅ If `book_bind_type` is "Computer Book Bind", `paper_type` must be provided and validated
        if book_bind_type.book_bind_type_name == "Computer Book Bind":
            if not paper_type:
                return Response({"error": "Paper type is required for Computer Book Bind."}, status=status.HTTP_400_BAD_REQUEST)

            total_sheets_required = page_count * quantity  # Calculate total sheets needed

            # ✅ Validate inventory based on `sheets_per_ream`
            total_sheets_available = work_in_process_inventory.aggregate(total_sheets=Sum("sheets_per_ream"))["total_sheets"] or 0
            if total_sheets_available < total_sheets_required:
                return Response({"error": "INSUFFICIENT STOCKS"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ If `book_bind_request_type` is "Ring Bound", `ring_binder_type` must be provided
        if book_bind_request_type.request_type_name == "Ring Bound":
            if not ring_binder_type:
                return Response({"error": "Ring binder type is required for Ring Bound."}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Save the request
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request_instance = serializer.save(page_count=page_count)

        # ✅ Prepare the response
        headers = self.get_success_headers(serializer.data)
        response_data = serializer.data
        response_data["page_count"] = page_count  # Include page count in the response

        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

    
class GetBookBindPersonnelRequestView(generics.ListAPIView):
    queryset = BookBindingPersonnelRequest.objects.all()
    serializer_class = DisplayBookBindPersonnelRequestSerializer

class CreateBookBindPersonnelQueueView(generics.ListCreateAPIView):
    queryset = BookBindQueue.objects.all()
    serializer_class = BookBindPersonnelQueueSerializer

class GetBookBindPersonnelQueueView(generics.ListAPIView):
    queryset = BookBindQueue.objects.all()
    serializer_class = DisplayBookBindPersonnelQueueSerializer

class BookBindUpdateRequestView(generics.RetrieveUpdateAPIView):
    queryset = BookBindQueue.objects.all()
    serializer_class = DisplayBookBindPersonnelQueueSerializer

    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('queue_status', instance.queue_status)

        # Validate and update the queue_status field
        if new_status in ["Ready to Claim", "In Progress", "Pending"]:
            instance.queue_status = new_status
            instance.save()

            # If the status is updated to "Ready to Claim", send email
            if new_status == "Ready to Claim":
                personnel_request = instance.book_bind_personnel_request
                user = personnel_request.user  # Get the related user
                email = user.email  # Get the user's email address

                # Construct the email message
                subject = "Your Book Bind Request is Ready to Claim"
                message = f"""
                        Dear {user.first_name} {user.last_name},

                        We are pleased to inform you that your book bind request is now ready to claim. You can proceed to the printing office to collect your document.

                        Here are the details of your request:

                        - Customer Name: {user.first_name} {user.last_name}
                        - Department: {user.department.department_name}
                        - Request Type: {personnel_request.book_binding_request_details.request_type.request_type_name}
                        - Paper Size: {personnel_request.book_binding_request_details.paper_type.paper_type}
                        - Quantity: {personnel_request.book_binding_request_details.quantity}

                        Thank you for using our book bind service.

                        Best regards,
                        The University Printing Press System
                        """
                from_email = "universityprintingpresssystem@gmail.com"

                # Send the email
                try:
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email=from_email,
                        recipient_list=[email],
                        auth_user="universityprintingpresssystem@gmail.com",
                        auth_password="hzxt srtp utoo ejgo",
                        fail_silently=False,
                    )
                except Exception as e:
                    return Response(
                        {"error": f"Failed to send email: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
        else:
            return Response({"error": "Invalid queue status"}, status=status.HTTP_400_BAD_REQUEST)


        # Return the updated instance data
        return Response(DisplayBookBindPersonnelQueueSerializer(instance).data)



class CreateBookBindStudentRequestView(generics.ListCreateAPIView):
    queryset = BookBindingStudentRequest.objects.all()
    serializer_class = BookBindStudentRequestSerializer

    def create(self, request, *args, **kwargs):
        # Extract PDF file from request
        pdf_file = request.FILES.get('pdf')

        # Calculate the number of pages
        if pdf_file:
            page_count = 0
            try:
                reader = PdfReader(pdf_file)
                page_count = len(reader.pages)
            except Exception as e:
                return Response({"error": f"Failed to read PDF: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # If no PDF, get the page count manually from the input
            page_count = request.data.get('page_count')
            if not page_count or not page_count.isdigit():
                return Response({"error": "Manual page count is required and must be a positive integer when no PDF is provided."}, 
                                status=status.HTTP_400_BAD_REQUEST)
            page_count = int(page_count)
            
            
        book_binding_request_details_id = request.data.get('book_binding_request_details')

        if not book_binding_request_details_id:
            return Response({"error": "Book Bind Request details are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            book_binding_request_details = BookBindingRequestDetails.objects.get(id=book_binding_request_details_id)
        except BookBindingRequestDetails.DoesNotExist:
            return Response({"error": "Book Bind Request details not found."}, status=status.HTTP_404_NOT_FOUND)

        # Extract paper_type and quantity from PrintRequestDetails
        paper_type = book_binding_request_details.paper_type
        quantity = book_binding_request_details.quantity

        if not paper_type:
            return Response({"error": "Paper type is missing in PrintRequestDetails."}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total pages required
        total_pages_required = page_count * quantity

        # Validate inventory for total pages required
        try:
            validate_inventory(paper_type.id, total_pages_required)
        except ValidationError as e:
            return Response({"error": "INSUFFICIENT STOCKS"}, status=status.HTTP_400_BAD_REQUEST)

        # Save the request
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request_instance = serializer.save(page_count=page_count)

        # Prepare the response
        headers = self.get_success_headers(serializer.data)
        response_data = serializer.data
        response_data['page_count'] = page_count  # Include page count in the response

        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)


class GetBookBindStudentRequestView(generics.ListAPIView):
    queryset = BookBindingStudentRequest.objects.all()
    serializer_class = DisplayBookBindStudentRequestSerializer

class CreateBookBindStudentQueueView(generics.ListCreateAPIView):
    queryset = BookBindStudentQueue.objects.all()
    serializer_class = BookBindStudentQueueSerializer

class GetBookBindStudentQueueView(generics.ListAPIView):
    queryset = BookBindStudentQueue.objects.all()
    serializer_class = DisplayBookBindStudentQueueSerializer

class UpdateBookBindStudentQueueView(generics.RetrieveUpdateAPIView):
    queryset = BookBindStudentQueue.objects.all()
    serializer_class = DisplayBookBindStudentQueueSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('queue_status', instance.queue_status)

        # Validate and update the queue_status field
        if new_status in ["Ready to Claim", "In Progress", "Pending"]:
            instance.queue_status = new_status
            instance.save()

            # If the status is updated to "Ready to Claim", send email
            if new_status == "Ready to Claim":
                student_request = instance.book_bind_student_request
                user = student_request.book_bind_request  # Get the related user
                email = user.email  # Get the user's email address

                # Construct the email message
                subject = "Your Book Bind Request is Ready to Claim"
                message = f"""
                        Dear {user.first_name} {user.last_name},

                        We are pleased to inform you that your book bind request is now ready to claim. You can proceed to the printing office to collect your document.

                        Here are the details of your request:

                        - Customer Name: {user.first_name} {user.last_name}
                        - Department: {user.department.department_name}
                        - Request Type: {user.book_binding_request_details.request_type.request_type_name}
                        - Paper Size: {user.book_binding_request_details.paper_type.paper_type}
                        - Quantity: {user.book_binding_request_details.quantity}

                        Thank you for using our book bind service.

                        Best regards,
                        The University Printing Press System
                        """
                from_email = "universityprintingpresssystem@gmail.com"

                # Send the email
                try:
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email=from_email,
                        recipient_list=[email],
                        auth_user="universityprintingpresssystem@gmail.com",
                        auth_password="hzxt srtp utoo ejgo",
                        fail_silently=False,
                    )
                except Exception as e:
                    return Response(
                        {"error": f"Failed to send email: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
        else:
            return Response({"error": "Invalid queue status"}, status=status.HTTP_400_BAD_REQUEST)

        # Return the updated instance data
        return Response(DisplayBookBindStudentQueueSerializer(instance).data)
    
class DeletePersonnelBookBindReadyToClaimView(generics.DestroyAPIView):
    queryset = BookBindQueue.objects.all()
    serializer_class = DisplayBookBindPersonnelQueueSerializer
    
class DeleteStudentBookBindReadyToClaimView(generics.DestroyAPIView):
    queryset = BookBindStudentQueue.objects.all()
    serializer_class = DisplayBookBindStudentQueueSerializer

class EditBookBindRequestView(generics.UpdateAPIView):
    queryset = BookBindQueue.objects.all()
    serializer_class = EditBookBindRequestSerializer



##################################################################################################
# LAMINATION VIEWS 
##################################################################################################

class CreateLaminationType(generics.ListCreateAPIView):
    queryset = LaminationType.objects.all()
    serializer_class = TypeLaminationSerializer


class CreateLaminationTypeView(generics.ListCreateAPIView):
    queryset = LaminationRequestType.objects.all()
    serializer_class = LaminationTypeSerializer

class CreateLaminationRequestDetailsView(generics.ListCreateAPIView):
    queryset = LaminationRequestDetails.objects.all()
    serializer_class = LaminationRequestDetailsSerializer

class GetLaminationRequestDetailsView(generics.ListAPIView):
    queryset = LaminationRequestDetails.objects.all()
    serializer_class = DisplayLaminationRequestDetailsSerializer

class CreateLaminationPersonnelRequestView(generics.ListCreateAPIView):
    queryset = LaminationPersonnelRequest.objects.all()
    serializer_class = LaminationPersonnelRequestSerializer

    def create(self, request, *args, **kwargs):
        # Extract PDF file from request
        pdf_file = request.FILES.get('pdf')
        page_count = 0

        # Calculate the number of pages
        if pdf_file:
            try:
                reader = PdfReader(pdf_file)
                page_count = len(reader.pages)
            except Exception as e:
                return Response({"error": f"Failed to read PDF: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # If no PDF, get the page count manually from the input
            page_count = request.data.get('page_count')
            if not page_count or not page_count.isdigit():
                return Response({"error": "Manual page count is required and must be a positive integer when no PDF is provided."}, 
                                status=status.HTTP_400_BAD_REQUEST)
            page_count = int(page_count)
            
        lamination_request_details_id = request.data.get('lamination_request_details')

        if not lamination_request_details_id:
            return Response({"error": "Lamination Request details are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lamination_request_details = LaminationRequestDetails.objects.get(id=lamination_request_details_id)
        except LaminationRequestDetails.DoesNotExist:
            return Response({"error": "Lamination details not found."}, status=status.HTTP_404_NOT_FOUND)

        # Extract paper_type and quantity from PrintRequestDetails
        paper_type = lamination_request_details.paper_type
        quantity = lamination_request_details.quantity

        if not paper_type:
            return Response({"error": "Paper type is missing in PrintRequestDetails."}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total pages required
        total_pages_required = page_count * quantity

        # Validate inventory for total pages required
        try:
            validate_inventory(paper_type.id, total_pages_required)
        except ValidationError as e:
            return Response({"error": "INSUFFICIENT STOCKS"}, status=status.HTTP_400_BAD_REQUEST)

        # Save the request
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request_instance = serializer.save(page_count=page_count)

        # Prepare the response
        headers = self.get_success_headers(serializer.data)
        response_data = serializer.data
        response_data['page_count'] = page_count  # Include page count in the response

        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

class GetLaminationPersonnelRequestView(generics.ListAPIView):
    queryset = LaminationPersonnelRequest.objects.all()
    serializer_class = DisplayLaminationPersonnelRequestSerializer

class CreateLaminationPersonnelQueueView(generics.ListCreateAPIView):
    queryset = LaminationPersonnelQueue.objects.all()
    serializer_class = LaminationPersonnelQueueSerializer

class GetLaminationPersonnelQueueView(generics.ListAPIView):
    queryset = LaminationPersonnelQueue.objects.all()
    serializer_class = DisplayLaminationPersonnelQueueSerializer

class EditLaminationRequestView(generics.UpdateAPIView):
    queryset = LaminationPersonnelQueue.objects.all()  
    serializer_class = EditLaminationSerializer 

class LaminationUpdateRequestView(generics.RetrieveUpdateAPIView):
    queryset = LaminationPersonnelQueue.objects.all()
    serializer_class = DisplayLaminationPersonnelQueueSerializer

    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('queue_status', instance.queue_status)

        # Validate and update the queue_status field
        if new_status in ["Ready to Claim", "In Progress", "Pending"]:
            instance.queue_status = new_status
            instance.save()

            # If the status is updated to "Ready to Claim", send email
            if new_status == "Ready to Claim":
                personnel_request = instance.lamination_personnel_request
                user = personnel_request.user  # Get the related user
                email = user.email  # Get the user's email address

                # Construct the email message
                subject = "Your Lamination is Ready to Claim"
                message = f"""
                        Dear {user.first_name} {user.last_name},

                        We are pleased to inform you that your lamination request is now ready to claim. You can proceed to the printing office to collect your document.

                        Here are the details of your request:

                        - Customer Name: {user.first_name} {user.last_name}
                        - Department: {user.department.department_name}
                        - Request Type: {personnel_request.lamination_request_details.request_type.request_type_name}
                        - Paper Size: {personnel_request.lamination_request_details.paper_type.paper_type}
                        - Quantity: {personnel_request.lamination_request_details.quantity}

                        Thank you for using our lamination service.

                        Best regards,
                        The University Printing Press System
                        """
                from_email = "universityprintingpresssystem@gmail.com"

                # Send the email
                try:
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email=from_email,
                        recipient_list=[email],
                        auth_user="universityprintingpresssystem@gmail.com",
                        auth_password="hzxt srtp utoo ejgo",
                        fail_silently=False,
                    )
                except Exception as e:
                    return Response(
                        {"error": f"Failed to send email: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
        else:
            return Response({"error": "Invalid queue status"}, status=status.HTTP_400_BAD_REQUEST)

        # Return the updated instance data
        return Response(DisplayLaminationPersonnelQueueSerializer(instance).data)

class CreateLaminationStudentRequestView(generics.ListCreateAPIView):
    queryset = LaminationStudentRequest.objects.all()
    serializer_class = LaminationStudentRequestSerializer

    def create(self, request, *args, **kwargs):
        # Extract PDF file from request
        pdf_file = request.FILES.get('pdf')
        

        # Calculate the number of pages
        if pdf_file:
            page_count = 0
            try:
                reader = PdfReader(pdf_file)
                page_count = len(reader.pages)
            except Exception as e:
                return Response({"error": f"Failed to read PDF: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # If no PDF, get the page count manually from the input
            page_count = request.data.get('page_count')
            if not page_count or not page_count.isdigit():
                return Response({"error": "Manual page count is required and must be a positive integer when no PDF is provided."}, 
                                status=status.HTTP_400_BAD_REQUEST)
            page_count = int(page_count)
            
        lamination_request_details_id = request.data.get('lamination_request_details')

        if not lamination_request_details_id:
            return Response({"error": "Lamination request details are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lamination_request_details = LaminationRequestDetails.objects.get(id=lamination_request_details_id)
        except LaminationRequestDetails.DoesNotExist:
            return Response({"error": "Lamination request details not found."}, status=status.HTTP_404_NOT_FOUND)

        # Extract paper_type and quantity from PrintRequestDetails
        paper_type = lamination_request_details.paper_type
        quantity = lamination_request_details.quantity

        if not paper_type:
            return Response({"error": "Paper type is missing in PrintRequestDetails."}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total pages required
        total_pages_required = page_count * quantity

        # Validate inventory for total pages required
        try:
            validate_inventory(paper_type.id, total_pages_required)
        except ValidationError as e:
            return Response({"error": "INSUFFICIENT STOCKS"}, status=status.HTTP_400_BAD_REQUEST)

        # Save the request
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request_instance = serializer.save(page_count=page_count)

        # Prepare the response
        headers = self.get_success_headers(serializer.data)
        response_data = serializer.data
        response_data['page_count'] = page_count  # Include page count in the response

        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)
    
class GetLaminationStudentRequestView(generics.ListAPIView):
    queryset = LaminationStudentRequest.objects.all()
    serializer_class = DisplayLaminationStudentRequestSerializer


class CreateLaminationStudentQueueView(generics.ListCreateAPIView):
    queryset = LaminationStudentQueue.objects.all()
    serializer_class = LaminationStudentQueueSerializer

class GetLaminationStudentQueueView(generics.ListAPIView):
    queryset = LaminationStudentQueue.objects.all()
    serializer_class = DisplayLaminationStudentQueueSerializer

class LaminationUpdateStudentRequestView(generics.RetrieveUpdateAPIView):
    queryset = LaminationStudentQueue.objects.all()
    serializer_class = DisplayLaminationStudentQueueSerializer

    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('queue_status', instance.queue_status)

        # Validate and update the queue_status field
        if new_status in ["Ready to Claim", "In Progress", "Pending"]:
            instance.queue_status = new_status
            instance.save()

            # If the status is updated to "Ready to Claim", send email
            if new_status == "Ready to Claim":
                personnel_request = instance.lamination_student_request
                user = personnel_request.lamination_request  # Get the related user
                email = user.email  # Get the user's email address

                # Construct the email message
                subject = "Your Lamination is Ready to Claim"
                message = f"""
                        Dear {user.first_name} {user.last_name},

                        We are pleased to inform you that your lamination request is now ready to claim. You can proceed to the printing office to collect your document.

                        Here are the details of your request:

                        - Customer Name: {user.first_name} {user.last_name}
                        - Department: {user.department.department_name}
                        - Request Type: {user.lamination_request_details.request_type.request_type_name}
                        - Paper Size: {user.lamination_request_details.paper_type.paper_type}
                        - Quantity: {user.lamination_request_details.quantity}

                        Thank you for using our lamination service.

                        Best regards,
                        The University Printing Press System
                        """
                from_email = "universityprintingpresssystem@gmail.com"

                # Send the email
                try:
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email=from_email,
                        recipient_list=[email],
                        auth_user="universityprintingpresssystem@gmail.com",
                        auth_password="hzxt srtp utoo ejgo",
                        fail_silently=False,
                    )
                except Exception as e:
                    return Response(
                        {"error": f"Failed to send email: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
        else:
            return Response({"error": "Invalid queue status"}, status=status.HTTP_400_BAD_REQUEST)

        # Return the updated instance data
        return Response(DisplayLaminationPersonnelQueueSerializer(instance).data)
    
class DeletePersonnelLaminationReadyToClaimView(generics.DestroyAPIView):
    queryset = LaminationPersonnelQueue.objects.all()
    serializer_class = DisplayLaminationPersonnelQueueSerializer

class DeleteStudentLaminationReadyToClaimView(generics.DestroyAPIView):
    queryset = LaminationStudentQueue.objects.all()
    serializer_class = DisplayLaminationStudentQueueSerializer






class FileUploadView(generics.ListCreateAPIView):
    queryset = FileUpload.objects.all()
    serializer_class = FileSerializers

    
class FileRetrieveView(generics.RetrieveAPIView):
    queryset = FileUpload.objects.all()
    serializer_class = FileSerializers


class BillPrintingQueue(APIView):
    def get(self, request):
        printing_queue = StudentQueueDetails.objects.filter(
            student_print_request__request_type="Printing"
        )
        serializer = StudentQueueDetailsSerializer(printing_queue, many=True)
        return Response(serializer.data)


class BookBindingQueueView(APIView):
    def get(self, request):
        book_binding_queue = BookBindStudentQueue.objects.filter(
            book_bind_student_request__request_type="Book Binding"
        )
        serializer = BookBindStudentQueueSerializer(book_binding_queue, many=True)
        return Response(serializer.data)
    

### INVENTORY VIEWS ###

class InventoryItemListCreateView(generics.ListCreateAPIView):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer

class InventoryItemDetailView(generics.RetrieveUpdateAPIView):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer

class RawMaterialsInventoryListCreateView(generics.ListCreateAPIView):
    queryset = RawMaterialsInventory.objects.all()
    serializer_class = RawMaterialsInventorySerializer

class RawMaterialsInventoryDetailView(generics.RetrieveUpdateAPIView):
    queryset = RawMaterialsInventory.objects.all()
    serializer_class = RawMaterialsInventorySerializer

class AddStockToRawMaterialsView(APIView):
    """Adds stock to a specific item in RawMaterialsInventory."""

    def post(self, request, *args, **kwargs):
        item_id = request.data.get("item_id")
        quantity = int(request.data.get("quantity", 0))

        if quantity <= 0:
            return Response({"error": "Quantity must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            inventory_item = InventoryItem.objects.get(id=item_id)
            raw_material, created = RawMaterialsInventory.objects.get_or_create(inventory_item=inventory_item)

            # Update stock in InventoryItem
            previous_balance = inventory_item.balance_per_card
            inventory_item.balance_per_card += quantity
            inventory_item.save()

            # Update stock in RawMaterialsInventory
            previous_stock = raw_material.stock_quantity
            raw_material.stock_quantity += quantity
            raw_material.save()

            # Log stock addition in StockCard
            StockCard.objects.create(
                raw_materials_inventory=raw_material,
                issued=timezone.now().date(),
                requisition="",
                receiver="Supply",
                quantity_issued=0,
                quantity_received=quantity,
                quantity_on_hand=raw_material.stock_quantity,
                remarks=f"Added {quantity} (Prev: {previous_stock})"
            )

            return Response({
                "message": "Stock added successfully",
                "new_balance_per_card": inventory_item.balance_per_card,
                "new_stock_quantity": raw_material.stock_quantity
            }, status=status.HTTP_200_OK)

        except InventoryItem.DoesNotExist:
            return Response({"error": "Inventory item not found"}, status=status.HTTP_404_NOT_FOUND)

# Work In Process Inventory CRUD Views
class WorkInProcessInventoryListCreateView(generics.ListCreateAPIView):
    queryset = WorkInProcessInventory.objects.all().order_by("created_at")  # FIFO order
    serializer_class = WorkInProcessInventorySerializer


class WorkInProcessInventoryDetailView(generics.RetrieveUpdateAPIView):
    queryset = WorkInProcessInventory.objects.all()
    serializer_class = WorkInProcessInventorySerializer


class TransferRawToWIPView(APIView):
    """Handles transfers from Raw Materials to Work In Process"""

    def post(self, request, *args, **kwargs):
        raw_material_id = request.data.get("raw_material_id")
        quantity = int(request.data.get("quantity", 0))

        try:
            raw_material = RawMaterialsInventory.objects.get(id=raw_material_id)

            if raw_material.inventory_item.balance_per_card < quantity:
                return Response({"error": "Not enough stock in Raw Materials"}, status=status.HTTP_400_BAD_REQUEST)

            # ✅ Deduct from Raw Materials
            previous_balance = raw_material.inventory_item.balance_per_card
            raw_material.inventory_item.balance_per_card -= quantity
            raw_material.inventory_item.save()

            # ✅ Create Stock Card Entry
            StockCard.objects.create(
                raw_materials_inventory=raw_material,
                issued=timezone.now().date(),
                requisition="",
                receiver="Roy M.",
                quantity_issued=quantity,
                quantity_received=0,
                quantity_on_hand=raw_material.inventory_item.balance_per_card,
                remarks=f"Transferred {quantity} from Raw Materials (Prev: {previous_balance})"
            )

            # ✅ Update Work In Process Inventory
            wip_entry, created = WorkInProcessInventory.objects.get_or_create(
                inventory_item=raw_material.inventory_item,
                defaults={"balance_per_card": 0, "sheets_per_ream": 0},
                
            )
            wip_entry.balance_per_card += quantity
            

            if wip_entry.inventory_item.unit in ['ream', 'reams']:
                wip_entry.sheets_per_ream = wip_entry.balance_per_card * 500
                available_count_unit = quantity * 500

            elif wip_entry.inventory_item.unit == 'length'or wip_entry.inventory_item.category == 'Film' :
                wip_entry.sheets_per_ream = wip_entry.balance_per_card * 4
                available_count_unit = quantity * 4
            else:
                wip_entry.sheets_per_ream = wip_entry.balance_per_card
                available_count_unit = quantity 
                


            wip_entry.save()

            
            # ✅ Log FIFO entry (Tracking Transfers)
            WorkInProcessFIFO.objects.create(
                work_in_process=wip_entry,
                transferred_quantity=quantity,
                sheets_per_ream = wip_entry.sheets_per_ream,
                transferred_count = available_count_unit
            )

            # ✅ Calculate First & Last Day of the Current Month
            today = timezone.now().date()
            first_day = today.replace(day=1)
            last_day = (first_day.replace(month=first_day.month % 12 + 1, day=1) - timedelta(days=1))

            # ✅ Update or Create Report Entry
            report, created = ReportOfMaterialsAndMaterialsIssued.objects.get_or_create(
                raw_materials_inventory=raw_material,
                date__range=[first_day, last_day],  # Ensure it's within the current month
                defaults={
                    "date": first_day,  # Always first day of the month
                    "responsibility_center_code": None,
                    "stock_number": None,
                    "item": raw_material.inventory_item.name,
                    "unit": raw_material.inventory_item.unit,
                    "quantity_issued": quantity,  # Start with current issued quantity
                    "unit_cost": raw_material.inventory_item.unit_value,
                    "amount": raw_material.inventory_item.unit_value * quantity,
                    "or_number": None,
                }
            )

            if not created:
                report.quantity_issued = (report.quantity_issued or 0) + quantity  # Update issued quantity
                report.amount = (report.unit_cost or 0) * report.quantity_issued  # Recalculate total cost
                report.save()

            return Response({   
                "message": "Stock transferred successfully",
                "raw_material_balance": raw_material.inventory_item.balance_per_card,
                "wip_balance": wip_entry.balance_per_card,
                "report_updated": not created  # True if existing report was updated
            }, status=status.HTTP_200_OK)

        except RawMaterialsInventory.DoesNotExist:
            return Response({"error": "Raw material not found"}, status=status.HTTP_404_NOT_FOUND)






class DeductFIFOStockView(APIView):
    def post(self, request):
        paper_type_id = request.data.get("paper_type_id")
        ink_color_id = request.data.get("ink_color_id")
        toner_color_id = request.data.get("toner_color_id")
        ring_binder_type_id = request.data.get("ring_binder_type_id")
        film_category = request.data.get("film_category")
        quantity = int(request.data.get("quantity", 0))


        if quantity <= 0:
            return Response({"error": "Valid quantity is required"}, status=status.HTTP_400_BAD_REQUEST)

        total_deducted = 0
        updated_entries = []

        def process_fifo(inventory_queryset, unit_size):
            nonlocal total_deducted

            fifo_entries = WorkInProcessFIFO.objects.filter(
                work_in_process__in=inventory_queryset, transferred_quantity__gt=0
            ).order_by("created_at")

            for fifo_entry in fifo_entries:
                if total_deducted >= quantity:
                    break
                if fifo_entry.transferred_quantity == 0:
                    continue

                remaining_quantity = quantity - total_deducted
                max_deductible_units = fifo_entry.transferred_quantity * unit_size

                if remaining_quantity >= max_deductible_units:
                    units_to_deduct = max_deductible_units
                    fifo_entry.transferred_count = max(0, fifo_entry.transferred_count - units_to_deduct)
                else:
                    units_to_deduct = remaining_quantity
                    fifo_entry.transferred_count = max(0, fifo_entry.transferred_count - units_to_deduct)

                total_deducted += units_to_deduct

                new_transferred_quantity = fifo_entry.transferred_count // unit_size
                if fifo_entry.transferred_count % unit_size == 0:
                    fifo_entry.transferred_quantity = new_transferred_quantity
                
                fifo_entry.work_in_process.sheets_per_ream = max(0, fifo_entry.work_in_process.sheets_per_ream - units_to_deduct)
                fifo_entry.work_in_process.balance_per_card = max(0, fifo_entry.work_in_process.sheets_per_ream // unit_size)
                
                fifo_entry.save()
                fifo_entry.work_in_process.save()

                updated_entries.append({
                    "fifo_id": fifo_entry.id,
                    "work_in_process_id": fifo_entry.work_in_process.id,
                    "sheets_per_ream": fifo_entry.work_in_process.sheets_per_ream,
                    "balance_per_card": fifo_entry.work_in_process.balance_per_card,
                    "transferred_quantity": fifo_entry.transferred_quantity,
                    "transferred_count": fifo_entry.transferred_count,
                })

        if paper_type_id:
            paper_inventories = WorkInProcessInventory.objects.filter(
                inventory_item__paper_type_id=paper_type_id
            ).order_by("created_at")
            process_fifo(paper_inventories, 500)
        if ink_color_id:
            ink_inventories = WorkInProcessInventory.objects.filter(
                inventory_item__ink_color_id=ink_color_id
            ).order_by("created_at")
            process_fifo(ink_inventories, 1)
        if toner_color_id:
            toner_inventories = WorkInProcessInventory.objects.filter(
                inventory_item__toner_color_id=toner_color_id
            ).order_by("created_at")
            process_fifo(toner_inventories, 1)
        if ring_binder_type_id:
            binder_inventories = WorkInProcessInventory.objects.filter(
                inventory_item__ring_binder_type_id=ring_binder_type_id
            ).order_by("created_at")
            process_fifo(binder_inventories, 4)

        if film_category:
            film_inventories = WorkInProcessInventory.objects.filter(
                inventory_item__category="Film"
            ).order_by("created_at")
            process_fifo(film_inventories, 4)

        if total_deducted < quantity:
            return Response({"error": "Not enough stock available to fulfill the request"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "message": "Items deducted successfully",
            "total_items_deducted": total_deducted,
            "updated_entries": updated_entries
        }, status=status.HTTP_200_OK)
















class WorkInProcessFIFOListView(generics.ListAPIView):
    """View Work In Process FIFO transfers in FIFO order."""
    serializer_class = WorkInProcessFIFOSerializer  # ✅ Use a new FIFO serializer

    def get_queryset(self):
        category = self.request.query_params.get("category", None)
        size = self.request.query_params.get("size", None)  # Paper size (A4, Legal, etc.)
        color = self.request.query_params.get("color", None)  # Ink color filter
        toner_color = self.request.query_params.get("toner_color", None)
        ring_binder_size = self.request.query_params.get("ring_binder_size", None)  # Ring binder type filter

        queryset = WorkInProcessFIFO.objects.all().order_by("created_at")  # ✅ FIFO ordering

        if category:
            
            queryset = queryset.filter(work_in_process__inventory_item__category__iexact=category)

            if category.lower() == "paper" and size:
                queryset = queryset.filter(work_in_process__inventory_item__paper_type__paper_type=size)

            elif category.lower() == "ink" and color:
                queryset = queryset.filter(work_in_process__inventory_item__ink_type__ink_color__iexact=color)

            elif category.lower() == "toner" and toner_color:
                queryset = queryset.filter(work_in_process__inventory_item__toner_type__toner_color__iexact=toner_color)

            elif category.lower() == "binding" and ring_binder_size:
                queryset = queryset.filter(work_in_process__inventory_item__ring_binder_size__exact=ring_binder_size)

            elif category.lower() == "film":
                queryset = queryset.filter(work_in_process__inventory_item__category="Film")

        return queryset




class StockCardView(generics.ListCreateAPIView):
    queryset = StockCard.objects.all().order_by("-issued")  # Show latest first
    serializer_class = StockCardSerializer

    def perform_create(self, serializer):
        """Automatically handle stock card transactions."""
        serializer.save()


class StockCardByInventoryView(generics.ListCreateAPIView):
    serializer_class = StockCardSerializer

    def get_queryset(self):
        """Filter stock cards by raw_materials_inventory ID"""
        inventory_id = self.kwargs["inventory_id"]
        return StockCard.objects.filter(raw_materials_inventory_id=inventory_id).order_by("-issued")
    
class ReportOfSuppliesAndMaterialsView(generics.ListCreateAPIView):
    serializer_class = ReportOfSuppliesAndMaterialsIssuedSerializer

    def get_queryset(self):
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')

        if month and year:
            first_day = datetime(int(year), int(month), 1).date()
            last_day = (first_day.replace(month=first_day.month % 12 + 1, day=1) - timedelta(days=1))
        else:
            today = now().date()
            first_day = today.replace(day=1)
            last_day = (first_day.replace(month=first_day.month % 12 + 1, day=1) - timedelta(days=1))

        queryset = ReportOfMaterialsAndMaterialsIssued.objects.filter(date__range=[first_day, last_day])

        # Attach first_day and last_day to each instance dynamically
        for obj in queryset:
            obj.first_day = first_day
            obj.last_day = last_day

        return queryset
