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

def home(request):
    return render(request, 'home.html')

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

class UpdateUserView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = GetUserSerializer

class StudentView(generics.ListCreateAPIView):
    queryset = StudentPrintForm.objects.all()
    serializer_class = StudentFormSerializer

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

        # Save the request
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request_instance = serializer.save(page_count=page_count)

        # Prepare the response
        headers = self.get_success_headers(serializer.data)
        response_data = serializer.data
        response_data['page_count'] = page_count  # Include page count in the response

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
                personnel_request = instance.student_print_request
                user = personnel_request.request  # Get the related user
                email = user.email  # Get the user's email address

                # Construct the email message
                subject = "Your Print Request is Ready to Claim"
                message = f"Dear {user.first_name} {user.last_name},\n\nYour print request is now marked as 'Ready to Claim'. You can proceed to the printing office to claim your document.\n\nThank you!"
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

                # Construct the email message
                subject = "Your Print Request is Ready to Claim"
                message = f"Dear {user.first_name} {user.last_name},\n\nYour print request is now marked as 'Ready to Claim'. You can proceed to the printing office to claim your document.\n\nThank you!"
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

        # Save the request
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request_instance = serializer.save(page_count=page_count)

        # Prepare the response
        headers = self.get_success_headers(serializer.data)
        response_data = serializer.data
        response_data['page_count'] = page_count  # Include page count in the response
        response_data['file_url'] = request.build_absolute_uri(response_data['pdf'])

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
        pdf_file = request.FILES.get('pdf')
        page_count = 0

        # Calculate the number of pages
        if pdf_file:
            try:
                reader = PdfReader(pdf_file)
                page_count = len(reader.pages)
            except Exception as e:
                return Response({"error": f"Failed to read PDF: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Save the request
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request_instance = serializer.save(page_count=page_count)

        # Prepare the response
        headers = self.get_success_headers(serializer.data)
        response_data = serializer.data
        response_data['page_count'] = page_count  # Include page count in the response

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
                subject = "Your Print Request is Ready to Claim"
                message = f"Dear {user.first_name} {user.last_name},\n\nYour book bind request is now marked as 'Ready to Claim'. You can proceed to the printing office to claim your document.\n\nThank you!"
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
        page_count = 0

        # Calculate the number of pages
        if pdf_file:
            try:
                reader = PdfReader(pdf_file)
                page_count = len(reader.pages)
            except Exception as e:
                return Response({"error": f"Failed to read PDF: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

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
                personnel_request = instance.book_bind_student_request
                user = personnel_request.book_bind_request  # Get the related user
                email = user.email  # Get the user's email address

                # Construct the email message
                subject = "Your Print Request is Ready to Claim"
                message = f"Dear {user.first_name} {user.last_name},\n\nYour print request is now marked as 'Ready to Claim'. You can proceed to the printing office to claim your document.\n\nThank you!"
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
    
class DeleteStudentBookBindReadyToClaimView(generics.DestroyAPIView):
    queryset = BookBindStudentQueue.objects.all()
    serializer_class = DisplayBookBindStudentQueueSerializer


##################################################################################################
# LAMINATION VIEWS 
##################################################################################################


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
                subject = "Your Print Request is Ready to Claim"
                message = f"Dear {user.first_name} {user.last_name},\n\nYour lamination request is now marked as 'Ready to Claim'. You can proceed to the printing office to claim your document.\n\nThank you!"
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
        page_count = 0

        # Calculate the number of pages
        if pdf_file:
            try:
                reader = PdfReader(pdf_file)
                page_count = len(reader.pages)
            except Exception as e:
                return Response({"error": f"Failed to read PDF: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

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
                subject = "Your Print Request is Ready to Claim"
                message = f"Dear {user.first_name} {user.last_name},\n\nYour lamination request is now marked as 'Ready to Claim'. You can proceed to the printing office to claim your document.\n\nThank you!"
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

