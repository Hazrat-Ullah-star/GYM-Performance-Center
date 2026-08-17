from .models import Booking

def cancel_booking(booking: Booking) -> Booking:
    if booking.status == 'cancelled':
        raise ValueError('Booking is already cancelled')
    
    booking.status = 'cancelled'
    booking.save()
    return booking
