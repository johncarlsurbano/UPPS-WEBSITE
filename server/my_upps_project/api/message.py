def generate_request_accepted_message(instance):
    """
    Generates a structured email message for when the request is accepted.
    Args:
        instance: The PersonnelPrintRequest instance to pull information from.
    Returns:
        str: The formatted email message.
    """
    message = f"""
    Dear {instance.user.first_name} {instance.user.last_name},

    We are pleased to inform you that your print request has been accepted by the Chairman. Your request has now proceeded to the queue for further processing.

    Here are the details of your request:
    - Request ID: {instance.id}
    - Customer Name : {instance.user.first_name} {instance.user.last_name}
    - Department: {instance.user.department.department_name}
    - Position: {instance.user.position.position_name}
    - Request Type: {instance.print_request_details.printing_type.printing_type_name}
    - Paper Size: {instance.print_request_details.paper_type.paper_type}
    - Quantity: {instance.print_request_details.quantity}
    - Duplex: {instance.print_request_details.duplex}
    - Date Created: {instance.created_at.strftime('%Y-%m-%d %H:%M:%S')}
    - Date Accepted: {instance.updated_at.strftime('%Y-%m-%d %H:%M:%S')}

    You will be notified once the request is completed and ready for collection. If you have any questions, feel free to reach out to us.

    Thank you for your patience and cooperation.

    """
    return message