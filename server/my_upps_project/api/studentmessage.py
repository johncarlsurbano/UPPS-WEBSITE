def generate_readytoclaimprintstudent_message(instance):
    """
    Generates a structured email message for when the request is accepted.
    Args:
        instance: The PersonnelPrintRequest instance to pull information from.
    Returns:
        str: The formatted email message.
    """
    message = f"""
    Dear {instance.first_name} {instance.last_name},

    We regret to inform you that your print request has been declined by the Chairman. Unfortunately, your request will not be processed further.

    Here are the details of your request:

    - Request ID: {instance.id}
    - Customer Name: {instance.first_name} {instance.last_name}
    - Department: {instance.department.department_name}
    - Position: {instance.position.position_name}
    - Request Type: {instance.print_request_details.printing_type.printing_type_name}
    - Paper Size: {instance.print_request_details.paper_type.paper_type}
    - Quantity: {instance.print_request_details.quantity}
    - Duplex: {instance.print_request_details.duplex}
    - Date Created: {instance.created_at.strftime('%Y-%m-%d %H:%M:%S')}
    - Date Declined: {instance.updated_at.strftime('%Y-%m-%d %H:%M:%S')}

    If you have any questions or would like to discuss the matter further, please feel free to reach out to us.

    Thank you for your understanding.

 
    """
    return message