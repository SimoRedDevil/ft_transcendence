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

class GoogleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
        }

class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['full_name', 'avatar_url', 'phone_number', 'city', 'address', 'language']
        read_only_fields = ['username', 'email']
        extra_kwargs = {
            'password': {'write_only': True},
            'full_name': {'required': False, 'max_length': 40,
            },
            'phone_number': {'required': False, 'max_length': 15,
                'min_length': 6,
            },
            'city': {'required': False, 'max_length': 40,
            },
            'address': {'required': False, 'max_length': 40,
            },
            'language': {'required': False,
            },
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'full_name', 'username', 'email', 'phone_number', 'city', 'address', 'language', 'avatar_url', 'social_logged', 'tournament_name', 
            'tournament_score', 'enabeld_2fa', 'twofa_verified', 'qrcode_dir', 'qrcode_path',
            'level', 'matches', 'wins', 'losses', 'draws', 'profile_visited','is_active',
            'friends_count', 'top_score', 'tournaments', 'online_matches',
            'offline_matches', 'current_xp', 'target_xp', 'online']
        extra_kwargs = {
            'password': {'write_only': True},
        }
