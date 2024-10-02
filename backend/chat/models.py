from django.db import models

# Create your models here.

class conversation:
    id = models.AutoField(primary_key=True)
    user1_id = models.ForeignKey("auth.user", on_delete=models.CASCADE)
    user2_id = models.ForeignKey("auth.user", on_delete=models.CASCADE)
    creation_time = models.DateTimeField(auto_now_add=True)

class message:
    id = models.AutoField(primary_key=True)
    conversation_id = models.ForeignKey("conversation", on_delete=models.CASCADE)
    sender_id = models.ForeignKey("auth.user", on_delete=models.CASCADE)
    receiver_id = models.ForeignKey("auth.user", on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)
