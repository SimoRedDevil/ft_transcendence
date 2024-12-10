from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser
import re



def check_valid_format(data):
    username = data.get('username')
    password = data.get('password')

    if (len(username) > 20):
        raise serializers.ValidationError("Username should be between 9 and 20 characters")
    elif not re.match(r'^[A-Za-z-]+$', username):
        raise serializers.ValidationError("Username should only contain letters and optional hyphens.")

    elif (len(password) < 9 or len(password) > 20):
        raise serializers.ValidationError("Password should be between 9 and 20 characters")
    elif password.isdigit() or username.isdigit():
        raise serializers.ValidationError("Password and username should not be only numbers")
    elif password == username:
        raise serializers.ValidationError("Password and username should be different")

    return data

def check_username_exist(username):
    try:
        CustomUser.objects.get(username=username)
        return True
    except CustomUser.DoesNotExist:
        return False
class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['full_name', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True,
            },
            'full_name': {'required': True
            },
            'username': {'required': True
            },
            'email': {'required': True,
            },
        }
    def validate(self, data):
        return check_valid_format(data)
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

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("email does not exist")
        if not user.check_password(password):
            raise serializers.ValidationError("password is incorrect")
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
        fields = ['full_name', 'avatar_url', 'phone_number', 'city', 'address', 'language', 'color', 'board_name']
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
            'color': {'required': False,
            'max_length': 7,
            },
            'board_name': {'required': False,
            },
            'avatar_url': {'required': False,
            },
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'full_name', 'username', 'email', 'phone_number', 'city', 'address', 'language', 'color', 'board_name', 'avatar_url', 'social_logged', 'tournament_name', 
            'tournament_score', 'enabeld_2fa', 'is_already_logged', 'twofa_verified', 'qrcode_url', 'qrcode_path',
            'level', 'matches', 'wins', 'losses', 'draws', 'profile_visited','is_active',
            'friends_count', 'top_score', 'tournaments', 'online_matches',
            'offline_matches', 'current_xp', 'target_xp', 'online', 'friends', 'blocked_users']
        extra_kwargs = {
            'password': {'write_only': True},
        }

class FriendListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name', 'username', 'avatar_url', 'online', 'friends']

class BlockedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name', 'username', 'avatar_url', 'online', 'blocked_users']

class AnonymousUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
        }


class SimplifiedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'full_name', 'avatar_url', 'online', 'is_active']