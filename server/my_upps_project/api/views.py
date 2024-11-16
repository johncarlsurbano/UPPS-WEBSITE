from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializer import *
from rest_framework import generics
from django.core.mail import send_mail
from .message import generate_request_accepted_message


# # Create your views here.
@api_view(['GET'])
def getUser(request):
    users = User.objects.all()
    serializedData = UserSerializer(users, many=True).data
    return Response(serializedData)


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

class GetUserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = GetUserSerializer

class StudentView(generics.ListCreateAPIView):
    queryset = StudentPrintForm.objects.all()
    serializer_class = StudentFormSerializer

class StudentDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StudentPrintForm.objects.all()
    serializer_class = StudentFormSerializer

class RequestView(generics.ListCreateAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestFormSerializer


class PaperTypeView(generics.ListCreateAPIView):
    queryset = PaperType.objects.all()
    serializer_class = PaperTypeSerializer

class PrintingTypeView(generics.ListCreateAPIView):
    queryset = PrintingType.objects.all()
    serializer_class = PrintingTypeSerializer

class QueueView(generics.ListCreateAPIView):
    queryset = Queue.objects.all()
    serializer_class = QueueSerializer

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
    serializer_class = PersonnelPrintRequestSerializer

    def get_queryset(self):
        
        pk = self.kwargs['pk']
        
        return PersonnelPrintRequest.objects.filter(
            print_request_details__paper_type__paper_type=pk
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
                    recipient_list=[instance.email],   # Assumes `email` is a field in the model
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

        # Get the new queue status from the request data
        new_status = request.data.get('queue_status', instance.queue_status)

        # Validate and update the queue_status field
        if new_status in ["Ready to Claim", "In Progress","Pending"]:
            instance.queue_status = new_status
            instance.save()
        else:
            return Response({"error": "Invalid queue status"}, status=status.HTTP_400_BAD_REQUEST)

        # Return the updated instance data
        return Response(QueueSerializer(instance).data)


class CreateRequestView(generics.ListCreateAPIView):
    queryset = PersonnelPrintRequest.objects.all()
    serializer_class = CreateRequestSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['file_url'] = request.build_absolute_uri(response.data['pdf'])
        return response


class RetrieveReadyToClaimView(generics.ListAPIView):
    queryset = QueueDetails.objects.all()
    serializer_class = QueueSerializer

    def get_queryset(self):
        return QueueDetails.objects.filter(queue_status="Ready to Claim")
    
class DeleteReadyToClaimView(generics.DestroyAPIView):
    queryset = QueueDetails.objects.all()
    serializer_class = QueueSerializer


class DisplayPersonnelRequestView(generics.ListAPIView):
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

class FileUploadView(generics.ListCreateAPIView):
    queryset = FileUpload.objects.all()
    serializer_class = FileSerializers

    
    
class FileRetrieveView(generics.RetrieveAPIView):
    queryset = FileUpload.objects.all()
    serializer_class = FileSerializers


class BillView(generics.ListCreateAPIView):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer

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


def send_simple_email():
    subject = 'Hello from Django'
    message = 'This is a test email sent from Django.'
    from_email = 'your_email@gmail.com'
    recipient_list = ['recipient_email@gmail.com']

    send_mail(subject, message, from_email, recipient_list)