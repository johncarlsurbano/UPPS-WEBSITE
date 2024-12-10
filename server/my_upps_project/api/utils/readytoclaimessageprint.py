

def generate_readytoclaim_student_message(instance):
    """
    Generates a structured email message for when a student print request is ready to claim.
    Args:
        instance: The StudentPrintForm instance to pull information from.
    Returns:
        str: The formatted email message.
    """
   

    message = f"""
    Dear {instance.request.first_name} {instance.request.last_name},

    We are pleased to inform you that your print request is now ready to claim. You can proceed to the printing office to collect your document.

    Here are the details of your request:

    - Customer Name: {instance.request.first_name} {instance.request.last_name}
    - Department: {instance.request.department.department_name}
    - Request Type: {instance.request.print_request_details.printing_type.printing_type_name}
    - Paper Size: {instance.request.print_request_details.paper_type.paper_type}
    - Quantity: {instance.request.print_request_details.quantity}
    - Back to Back: {instance.request.print_request_details.duplex}
    - Date Created: {instance.request.created_at.strftime('%Y-%m-%d %H:%M:%S')}
    - Date Ready: {instance.request.updated_at.strftime('%Y-%m-%d %H:%M:%S')}

    Thank you for using our printing service.

    Best regards,
    The University Printing Press System
    """
    return message
