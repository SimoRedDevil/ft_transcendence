# from allauth.socialaccount.providers.base import ProviderAccount
# from allauth.socialaccount.providers.oauth2.provider import OAuth2Provider


# class FortyTwoAccount(ProviderAccount):
#     def get_avatar_url(self):
#         return self.account.extra_data.get('image_url')

#     def to_str(self):
#         return self.account.extra_data.get('login', super().to_str())


# class FortyTwoProvider(OAuth2Provider):
#     id = '42'
#     name = '42'
#     account_class = FortyTwoAccount

#     def extract_uid(self, data):
#         return str(data['id'])

#     def extract_common_fields(self, data):
#         return dict(
#             full_name=data.get('displayname'),
#             username=data.get('login'),
#             email=data.get('email'),
#         )
