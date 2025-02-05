from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    
    path('createuser/',UserView.as_view(), name="createuser"),
    path('login/', LoginView.as_view(), name="login"),
    path('validateemail/', EmailView.as_view(), name="validateemail"),
    path('generatecode/', SendRegistrationCodeView.as_view(), name="generatecode"),
    path('resetpassword/', ResetPasswordView.as_view(), name="resetpassword"),
    path('getuser/', GetUserView.as_view(), name="getuser"),
    path('updateuser/status/<int:pk>', UpdateUserStatusView.as_view(), name="updateuser"),
    path('updateuser/<int:pk>/', UpdateUserView.as_view(), name="updateuser"),

    path('studentform/',StudentView.as_view(), name="studentView"),
    path('getstudent/form', GetStudentView.as_view(), name="getStudent"),
    path('student/queue', StudentQueue.as_view(), name="studentQueue"),
    path('getstudent/queue/', DisplayStudentQueue.as_view(), name="displayStudentQueue"),
    path('updatestudent/queue/<int:pk>/', UpdateStudentQueueStatusView.as_view(), name="updatestudentqueue"),
    path('student/paymentslip/', PaymentSlipView.as_view(), name="paymentSlip"),
    path('getstudent/paymentslip/', DisplayPaymentSlipView.as_view(), name="paymentSlip"),
    path('student/paymentstatus/<int:pk>/', UpdatePaymentStatusSlipView.as_view(), name="paymentStatus"),
    path('deletestudent/request/<int:pk>/', DeleteStudentReadyToClaimView().as_view(), name="deletestudentrequest"),

    path('servicetype/', SeriviceTypeView.as_view(), name="servicetype"),
    path('papertype/', PaperTypeView.as_view(), name="paperType"),
    path('print/requesttype/', RequestTypeView.as_view(), name="requesttype"),
    path('print/printingtype/',PrintingTypeView.as_view(), name="printingType"),
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
    path('displaypersonnelrequest/',DisplayPersonnelRequest.as_view(), name="displaypersonnelrequest"),
    path('displaypersonnelqueue/print/',DisplayPersonnelPrintQueueRequest.as_view(), name="displaypersonnelrequest"),
    path('uploadfile/', FileUploadView.as_view(), name="uploadfile"),
    path('uploadfile/<int:pk>/', FileRetrieveView.as_view(), name="fileretrieve"),
    path('printinginventory/',DisplayPrintInventoryView.as_view(), name="printinginventory"),
    path('updateinventory/printing/<int:pk>/', UpdatePrintingInventoryView.as_view(), name="updateinventory"),
    path('displayprintdetails/', DisplayPrintDetailsView.as_view(), name="displayprintdetails"),
    path('updatepaidstatus/<int:pk>/', updatePaidStatusView.as_view(), name="updatepaidstatus"),
    path('signatories/', SignatoriesView.as_view(), name="signatories"),
    path('inventory/additem/', CreatePrintingInventoryView.as_view(), name="createprintinginventory"),
    path('inventory/addream/', InventoryAddReamView.as_view(), name="inventoryaddream"),
    path('deleteinventory/<int:pk>/', DeletePrintingInventoryView.as_view(), name="deleteinventory"),


    path('bill/',BillView.as_view(), name="billing"),
    path('displaybill/', DisplayBillRequestView.as_view(), name="displaybill"),
    # path('joborder/', JobOrderView.as_view(), name="joborder"),
    # path('getjoborder/', DisplayJobOrderView.as_view(), name="getjoborder"),

    ##############################
    ##### BOOKBINDING URLS
    ##############################

    ##### PERSONNEL
    path('bookbind/type', CreateBookBindType.as_view(), name="bookbindtype"),
    path('bookbind/requesttype', CreateBookBindRequestType.as_view(), name="requesttype"),
    path('bookbind/requestdetails', CreateBookBindRequestDetailsView.as_view(), name="requestdetails"),
    path('requestdetails', GetBookBindRequestDetailsView.as_view(), name="getrequestdetails"),
   
    path('personnel/request/bookbinding', CreateBookBindPersonnelRequestView.as_view(), name="createbookbind"),
    path('getpersonnel/request/bookbinding', GetBookBindPersonnelRequestView.as_view(), name="getbookbindrequest"),

    path('personnel/queue/bookbind', CreateBookBindPersonnelQueueView.as_view(), name="bookbindqueue"),
    path('getpersonnel/queue/bookbind', GetBookBindPersonnelQueueView.as_view(), name="getbookbindqueue"),

    path('personnel/updatequeue/bookbind/<int:pk>/', BookBindUpdateRequestView.as_view(), name="updatequeuebookbind"),
    path('deletepersonnel/request/bookbind/<int:pk>/', DeletePersonnelBookBindReadyToClaimView().as_view(), name="deletebookbindqueue"),


   ##### STUDENT
    path('student/request/bookbinding', CreateBookBindStudentRequestView.as_view(), name="createbookbindstudent"),
    path('getstudent/request/bookbinding', GetBookBindStudentRequestView.as_view(), name="getbookbindstudent"),
    path('student/queue/bookbinding', CreateBookBindStudentQueueView.as_view(), name="createbookbindqueue"),
    path('getstudent/queue/bookbinding', GetBookBindStudentQueueView.as_view(), name="getbookbindqueue"),
    path('student/updatequeue/bookbinding/<int:pk>/', UpdateBookBindStudentQueueView.as_view(), name="updatebookbindqueue"), 
    path('deletestudent/request/bookbind/<int:pk>/', DeleteStudentBookBindReadyToClaimView().as_view(), name="deletebookbindqueue"),



    ##############################
    ##### LAMINATION URLS
    ##############################
    ##### PERSONNEL
    path('lamination/type', CreateLaminationType.as_view(), name="createlamination"),
    path('lamination/requesttype', CreateLaminationTypeView.as_view(), name="laminationtype"),
    path('lamination/requestdetails', CreateLaminationRequestDetailsView.as_view(), name="laminationrequestdetails"),
    path('getlamination/requestdetails', GetLaminationRequestDetailsView.as_view(), name="getlaminationrequestdetails"),
    path('personnel/request/lamination', CreateLaminationPersonnelRequestView.as_view(), name="laminationrequest"),
    path('getpersonnel/request/lamination/', GetLaminationPersonnelRequestView.as_view(), name="getlaminationpersonnelrequest"),
    path('personnel/queue/lamination', CreateLaminationPersonnelQueueView.as_view(), name="laminationqueue"),
    path('getpersonnel/queue/lamination', GetLaminationPersonnelQueueView.as_view(), name="getpersonnelqueue"),
    path('personnel/updatequeue/lamination/<int:pk>/', LaminationUpdateRequestView.as_view(), name="updatelaminationqueue"),
    path('deletepersonnel/request/lamination/<int:pk>/', DeletePersonnelLaminationReadyToClaimView().as_view(), name="deletelaminationpersonnelqueue"),
    

    

    ##### STUDENT
    path('student/request/lamination', CreateLaminationStudentRequestView.as_view(), name="studentrequest"),
    path('getstudent/request/lamination', GetLaminationStudentRequestView.as_view(), name="getstudentrequest"),
    path('student/queue/lamination', CreateLaminationStudentQueueView.as_view(), name="studentrequestqueuelamination"),
    path ('getstudent/queue/lamination', GetLaminationStudentQueueView.as_view(), name="getstudentqueue"),
    path('student/updatequeue/lamination/<int:pk>/', LaminationUpdateStudentRequestView.as_view(), name="updatelaminationqueue"),
    path('deletestudent/request/lamination/<int:pk>/', DeleteStudentLaminationReadyToClaimView().as_view(), name="deletelaminationqueue"),





    # path('personnelacceptedprintrequest/', PersonnelAcceptedPrintRequestView.as_view(), name="acceptedpersonnelrequest"),
    # path('personneldeclineprintrequest/',PersonnelDeclinedPrintRequestView.as_view(), name="declinedpersonnelrequest")

        
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)