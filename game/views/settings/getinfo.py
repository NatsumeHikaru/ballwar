from django.http import JsonResponse
from game.models.player.player import Player

def getinfo_web(request):
    user = request.user
    # 判断用户是否登录
    if not user.is_authenticated:
        return JsonResponse({
            'result': "not login"
            })
    player = Player.objects.all()[0]
    return JsonResponse({
        'result': "success",
        'username': player.user.username, 
        'photo': player.photo,
        })

def getinfo(request):
    platform = request.GET.get('platform')
    return getinfo_web(request)
