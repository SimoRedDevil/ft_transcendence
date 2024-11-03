from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['full_name', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True,
            'min_length': 8,
            'max_length': 20,
            },
            'full_name': {'required': True, 'max_length': 20,
                'min_length': 9,
            },
            'username': {'required': True, 'max_length': 20,
                'min_length': 9,
            },
            'email': {'required': True, 'max_length': 50,
                'min_length': 9,
            },
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            full_name=validated_data['full_name'],
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        # Use CustomUser to authenticate by email
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")
        user = authenticate(username=user.username, password=password)
        if user and user.is_active:
            return data
        raise serializers.ValidationError("Invalid credentials")


class Intra42UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
        }

class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    intra_avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def get_avatar_url(self, obj):
        if obj.avatar_url:
            return f"http://localhost:8000/api/auth/{obj.avatar_url.url}"
        return None  # or return a default URL if no avatar exists

    def get_intra_avatar_url(self, obj):
        if obj.intra_avatar_url:
            return obj.intra_avatar_url
        return None
