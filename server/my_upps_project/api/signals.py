from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Bill, PrintingInventory

@receiver(post_save, sender=Bill)
def update_inventory(sender, instance, **kwargs):
    print_request_details = instance.print_request_details
    paper_type = print_request_details.paper_type
    quantity = print_request_details.quantity

    try:
        inventory = PrintingInventory.objects.get(paper_type=paper_type)
        inventory.onHand -= quantity
        if inventory.onHand <= 0:
            inventory.status = "Out-of-Stock"
        elif inventory.onHand <= 500:
            inventory.status = "Low-Stock"
        else:
            inventory.status = "In-Stock"
        inventory.save()
    except PrintingInventory.DoesNotExist:
        # Handle case where the paper type inventory doesn't exist
        pass
