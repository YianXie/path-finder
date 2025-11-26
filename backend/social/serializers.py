from rest_framework import serializers
from PIL import Image
from accounts.models import UserProfile

from .models import UserRating


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = UserProfile
        fields = ["name", "email"]


class UserRatingSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    image = serializers.SerializerMethodField()

    class Meta:
        model = UserRating
        fields = ["id", "rating", "comment", "created_at", "user", "image"]
        extra_kwargs = {
            "image": {
                "required": False,
            }
        }

    def get_image(self, obj):
        image_file = obj.image

        if not image_file:
            return None

        try:
            # Open the image file using Pillow to validate and get format
            img = Image.open(image_file.file)
            image_format = (
                img.format
            )  # Get the image format (e.g., 'JPEG', 'PNG', 'GIF')

            # Validate image format
            if image_format not in ["JPEG", "PNG"]:
                raise serializers.ValidationError(
                    "Unsupported image format. Only JPEG and PNG are allowed."
                )

            # Map image format to content type
            content_type_map = {
                "JPEG": "image/jpeg",
                "PNG": "image/png",
            }
            content_type = content_type_map.get(image_format, "image/jpeg")

            # Important: After reading the file, seek back to the beginning
            # so that it can be read again when saving.
            image_file.file.seek(0)

            # Return dictionary with image information
            return {
                "name": image_file.name,
                "size": image_file.size,
                "content_type": content_type,
                "url": image_file.url,
            }

        except FileNotFoundError:
            raise serializers.ValidationError("File not found")
        except IOError:
            raise serializers.ValidationError("IOError")
        except Exception as e:
            raise serializers.ValidationError(
                f"Could not determine image type or invalid image: {e}"
            )
