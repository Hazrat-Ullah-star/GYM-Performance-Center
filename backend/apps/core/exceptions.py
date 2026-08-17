from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Standardized error response format for all API errors.
    """
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            'error': exc.__class__.__name__,
            'detail': response.data.get('detail', response.data),
            'status_code': response.status_code
        }
        response.data = custom_data
    else:
        # Unhandled exceptions
        logger.error(f"Unhandled Exception: {exc}", exc_info=True)
        return Response({
            'error': 'InternalServerError',
            'detail': 'An unexpected error occurred.',
            'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
