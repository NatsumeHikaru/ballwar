from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from game.models.player.player import Player

def register(request):
    data = request.GET
    username = data.get("username", "").strip() #取出用户名并去掉前后空格
    password = data.get("password", "").strip()
    password_confirm = data.get("password_confirm", "").strip()
    if not username or not password:
        return JsonResponse({
            'result': "用户名和密码不能为空"
            })
    if password != password_confirm:
        return JsonResponse({
            'result': "两次密码不一致"
            })
    if User.objects.filter(username=username).exists(): #判断用户名是否有相同
        return JsonResponse({
            'result': "用户名已存在"
            })
    user = User(username=username)
    user.set_password(password)
    user.save()
    Player.objects.create(user=user,photo="https://hikaru.com.cn/wp-content/uploads/2021/09/90205419_p0.jpg")
    login(request, user)
    return JsonResponse({
        'result': "success"
        })
