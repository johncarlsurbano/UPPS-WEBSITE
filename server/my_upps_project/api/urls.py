from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('getuser/', getUser, name="getUser"),
    path('createuser/',UserView.as_view(), name="createuser"),
    path('getuser/', GetUserView.as_view(), name="getuser"),
    path('studentform/',StudentView.as_view(), name="studentView"),

    path('requestform/', RequestView.as_view(), name="requestView"),
    path('papertype/', PaperTypeView.as_view(), name="paperType"),
    path('printingtype/',PrintingTypeView.as_view(), name="printingType"),
    path('queue/', QueueView.as_view(), name="queue"),
    path('updaterequest/<int:pk>/', UpdateRequestView.as_view(), name="updateRequest"),
    path('studentform/<int:pk>/', StudentDetailsView.as_view(), name="studentForm"),
    path('department/',DepartmentView.as_view(), name="department"),
    path('position/', PositionView.as_view(), name="position"),
    path('printrequestdetails/',PrintRequestDetailsView.as_view(), name="printRequestDetails"),
    path('personnelprintrequest/', PersonnelPrintRequestView.as_view(), name="personnelPrintRequest"),
    path('retrievepersonnelrequest/<str:pk>/', RetrievePersonnelPrintRequestView.as_view(), name="retrievePersonnelPrintRequest"),
    path('requeststatus/<str:status>/', DisplayPendingRequestView.as_view(), name='pending-requests'),
    path('queue/',QueueView.as_view(), name="queue-list"),
    path('retrievereadytoclaim/', RetrieveReadyToClaimView.as_view(), name='retrievereadytoclaim'),
    path('updatequeue/<int:pk>/', UpdateQueueView.as_view(), name="updatequeue"),
    path('createrequest/',CreateRequestView.as_view(), name="createrequest"),
    path('deleterequest/<int:pk>/', DeleteReadyToClaimView.as_view(), name="deleterequest"),
    path('displaypersonnelrequest/',DisplayPersonnelRequestView.as_view(), name="displaypersonnelrequest"),
    path('uploadfile/', FileUploadView.as_view(), name="uploadfile"),
    path('uploadfile/<int:pk>/', FileRetrieveView.as_view(), name="fileretrieve"),
    path('bill/',BillView.as_view(), name="billing"),
    path('printinginventory/',DisplayPrintInventoryView.as_view(), name="printinginventory"),
    path('updateinventory/printing/<int:pk>/', UpdatePrintingInventoryView.as_view(), name="updateinventory"),
    path('displayprintdetails/', DisplayPrintDetailsView.as_view(), name="displayprintdetails"),
    path('displaybill/', DisplayBillRequestView.as_view(), name="displaybill"),
    path('updatepaidstatus/<int:pk>/', updatePaidStatusView.as_view(), name="updatepaidstatus"),
    path('signatories/', SignatoriesView.as_view(), name="signatories"),
    path('inventory/additem/', CreatePrintingInventoryView.as_view(), name="createprintinginventory"),
    path('deleteinventory/<int:pk>/', DeletePrintingInventoryView.as_view(), name="deleteinventory"),

    # path('personnelacceptedprintrequest/', PersonnelAcceptedPrintRequestView.as_view(), name="acceptedpersonnelrequest"),
    # path('personneldeclineprintrequest/',PersonnelDeclinedPrintRequestView.as_view(), name="declinedpersonnelrequest")

        
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)