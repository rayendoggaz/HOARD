from io import BytesIO
import PyPDF2
import glob

from django.http import FileResponse, JsonResponse, HttpResponseServerError
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator


from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes

from .models import File
from folder_backend.models import Folder

from .serializers import FileSerializer

import base64
from PIL import Image

class FileList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def get_queryset(self):
        user = self.request.user
        return File.objects.filter(user=user)
    
    def perform_create(self, serializer):
        # Save the file and return the serialized data
        serializer.save(user=self.request.user)
        return Response(FileSerializer(serializer.instance).data, status=status.HTTP_201_CREATED)

def download_file(request, file_uid):
    file_obj = get_object_or_404(File, uid=file_uid)
    original_extension = file_obj.file.name.split('.')[-1]
    response = FileResponse(file_obj.file, as_attachment=True)
    response['Content-Disposition'] = f'attachment; filename="{file_obj.file.name}"'
    return response

class CustomFileDelete(APIView):
    def delete(self, request, file_uid):
        file_instance = get_object_or_404(File, uid=file_uid)
        file_instance.file.delete()  # Delete the file from storage
        file_instance.delete()  # Delete the file record from the database
        return Response(status=status.HTTP_204_NO_CONTENT)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unpin_file(request, file_uid):
    if request.method == 'POST':
        try:
            # Get the file instance based on the UID
            file_instance = get_object_or_404(File, uid=file_uid)
            
            # Call the unpin method on the file instance
            file_instance.unpin()  # Implement unpin method in your File model
            
            # Return success response
            return JsonResponse({'success': True})
        except File.DoesNotExist as e:
            # Return error response if the file doesn't exist
            return JsonResponse({'error': f'File not found: {e}'}, status=404)
        except Exception as e:
            # Log the exception for debugging
            print(f'Error unpinning file: {e}')
            # Return error response for other exceptions
            return JsonResponse({'error': 'Internal Server Error'}, status=500)
    else:
        # Return error response for invalid request method
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
@require_POST
@csrf_exempt
@permission_classes([IsAuthenticated])
def toggle_pin_file(request, file_uid):
    if request.method == 'POST':
        try:
            file_instance = File.objects.get(uid=file_uid)
            file_instance.toggle_pin()  # Implement toggle_pin method in your File model
            return JsonResponse({'success': True})
        except File.DoesNotExist as e:
            return JsonResponse({'error': f'File not found: {e}'}, status=404)
        except Exception as e:
            # Log the exception for debugging
            print(f'Error toggling pin status: {e}')
            return JsonResponse({'error': 'Internal Server Error'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
class PinnedFilesAPIView(APIView):
    permission_classes = [IsAuthenticated] # Adjust permissions as needed

    def get(self, request, *args, **kwargs):
        try:
            # Assuming your File model has a 'pinned' field to filter pinned files
            pinned_files = File.objects.filter(pinned=True, user=request.user)
            serializer = FileSerializer(pinned_files, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

from django.http import JsonResponse
from django.db.models import Q
from .models import File
from .serializers import FileSerializer
import logging
from rest_framework.decorators import api_view

logger = logging.getLogger(__name__)

@api_view(['GET'])
def search_files(request):
    try:
        query = request.GET.get('query', '')
        print('Received query:', query)

        if not query:
            return Response({'message': 'No query parameter provided'}, status=400)

        # Get the authenticated user ID from the request
        user_id = request.user.id

        # Filter files based on the query and user
        results = File.objects.filter(Q(file__icontains=query) & Q(user=user_id))

        # Serialize the results and return them in the response
        serializer = FileSerializer(results, many=True)
        serialized_results = serializer.data

        return Response(serialized_results)

    except Exception as e:
        logger.exception("Error in search_files view: %s", str(e))
        return Response({'error': 'Internal Server Error'}, status=500)
    

@permission_classes([IsAuthenticated])
def file_preview(request, file_uid):
    try:
        # Retrieve the file object based on the UID
        file_instance = get_object_or_404(File, uid=file_uid)
        # Open the file and read its content
        with file_instance.file.open(mode='rb') as file:
            file_content = file.read()

        # Encode the file content as Base64
        encoded_content = base64.b64encode(file_content).decode('utf-8')

        # Check if the file is an image
        if file_instance.file.name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            # Decode the Base64 content back to bytes
            decoded_content = base64.b64decode(encoded_content)

            # Open the image from the decoded bytes
            image = Image.open(BytesIO(decoded_content))

            # Display the image
            image.show()

        # Check if the file is a PDF
        elif file_instance.file.name.lower().endswith('.pdf'):
            # Open the PDF file
            reader = PyPDF2.PdfFileReader(BytesIO(file_content))

            # Extract text from the PDF
            text = ''
            for page_num in range(reader.numPages):
                page = reader.getPage(page_num)
                text += page.extractText()

            # Print the extracted text
            print(text)

        # Return the Base64-encoded content in the response
        return JsonResponse({'file_content': encoded_content})
    except Exception as e:
        # Handle any errors and return an error response
        return HttpResponseServerError('Failed to retrieve file content: ' + str(e))
