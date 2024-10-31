import json
import math
import asyncio
from .models import Player, Match
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer


class paddles:
    def __init__(self, x, y,width, height, speed, color, chan_name, playerNu, username):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.color = color
        self.speed = speed
        self.chan_name = chan_name
        self.username = username
        self.playerNu = playerNu
        self.score = 0
        
    def to_dict(self):
        return {
            'x': self.x,
            'y': self.y,
            'width': self.width,
            'height': self.height,
            'color': self.color,
            'speed': self.speed,
            'chan_name': self.chan_name,
            'playerNu': self.playerNu,
            'username': self.username,
            'score': self.score
        }
        
class ball:
    def __init__(self, x, y, radius, dirrectionY, speed,color):
        self.x = x
        self.y = y
        self.radius = radius
        self.color = color
        self.directionX = 0
        self.directionY = dirrectionY
        self.speed = speed

    def to_dict(self):
        return {
            'x': self.x,
            'y': self.y,
            'radius': self.radius,
            'color': self.color,
            'directionX': self.directionX,
            'directionY': self.directionY,
            'speed': self.speed
        }

class Game(AsyncWebsocketConsumer):

    players = []
    match_making = []
    paddles = {}
    games = {}
    Ball = {}
    async def connect(self):
        await self.accept()
        self.player = None
        self.game_channel = None


    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == 'connection':
            username = data['data']['username']
            print(username)
            
            existPlayer = await sync_to_async(Player.objects.filter(username=username).exists)()
            if not existPlayer:
                await self.create_player(username)
            self.player = {
                'name': data['data']['username'],
                'id': self.channel_name,
                'player_id': '',
                'group_name': ''
            }
            Game.players.append(self.player)
            Game.match_making.append(self.player)
            await self.send(text_data=json.dumps({
                'type': 'connection',
                'player': self.player
            }))
            await self.matchmaking(data)
        if data['type'] == 'move':
            game_channel = data.get('game_channel')
            player_id = self.player.get('player_id')
            if game_channel in self.games and player_id in self.games[game_channel]:
                if data['direction'] == 'right':
                    if (self.games[game_channel][player_id].x + self.games[game_channel][player_id].width + self.games[game_channel][player_id].speed > 1):
                        self.games[game_channel][player_id].x = 1 - self.games[game_channel][player_id].width
                    else:
                        self.games[game_channel][player_id].x += self.games[game_channel][player_id].speed
                if data['direction'] == 'left':
                    if self.games[game_channel][player_id].x - self.games[game_channel][player_id].speed > 0:
                        self.games[game_channel][player_id].x -= self.games[game_channel][player_id].speed
                    else:
                        self.games[game_channel][player_id].x = 0
                
                await self.channel_layer.group_send(
                    game_channel,
                    {
                        'type': 'paddle_update',
                        'paddle': self.games[game_channel][player_id].to_dict(),
                        'playernumber': self.games[game_channel][player_id].playerNu
                    }
                )
    
        if data['type'] == 'update_ball':
            self.Ball.x += self.Ball.directionX
            self.Ball.y += self.Ball.directionY
            await self.channel_layer.group_send(
                data['game_channel'],
                {
                    'type': 'update_ball',
                    'ball': self.Ball.to_dict()
                }
            )
    
    async def disconnect(self, close_code):
        if self.player in Game.players:
            other_player_id = 'player1' if self.player['player_id'] == 'player2' else 'player2'
            game = self.games.get(self.player['group_name'])
            if self.player['group_name'] in self.games:
                await self.channel_layer.group_send(
                    self.player['group_name'],
                    {
                        'type': 'game_over',
                        'winner': game[other_player_id].username
                    }
                )
                await self.channel_layer.group_discard(
                    self.player['group_name'],
                    self.player['id']
                )
                await self.channel_layer.group_discard(
                    self.player['group_name'],
                    game[other_player_id].chan_name
                )
                del self.games[self.player['group_name']]
                

    async def matchmaking(self, data):
        if len(Game.match_making) >= 2:
            player1 = Game.match_making.pop(0)
            player1['player_id'] = 'player1'
            player2 = Game.match_making.pop(0)
            player2['player_id'] = 'player2'
            self.game_channel = f'game{player1["name"]}vs{player2["name"]}'
            player1['group_name'] = self.game_channel
            player2['group_name'] = self.game_channel
            await self.channel_layer.group_add(
                self.game_channel,
                player1['id']
            )
            
            await self.channel_layer.group_add(
                self.game_channel,
                player2['id']
            )

            self.paddles['player1'] = paddles(data['data']['x'],data['data']['y1'], data['data']['pw'], data['data']['ph'] ,data['data']['sp'], 'white', player1['id'], 1, player1['name'])
            self.paddles['player2'] = paddles(data['data']['x'],data['data']['y2'],data['data']['pw'], data['data']['ph'], data['data']['sp'], 'white', player2['id'], 2, player2['name'])
            self.Ball = ball(0.5, 0.5, data['data']['Walls']['wallsHeight']/25/2/data['data']['Walls']['wallsHeight'], data['data']['dirY'], data['data']['sp'] ,'white')
            self.games[self.game_channel] = {
                'player1' : self.paddles['player1'],
                'player2' : self.paddles['player2'],
                'ball' : self.Ball,
            }
            await self.update_matchCount(player1['name'])
            await self.update_matchCount(player2['name'])
            game_serialized = {
                'player1': self.games[self.game_channel]['player1'].to_dict(),
                'player2': self.games[self.game_channel]['player2'].to_dict(),
                'ball': self.games[self.game_channel]['ball'].to_dict()
            }
            await self.channel_layer.group_send(
                self.game_channel,
                {
                    'type': 'start_game',
                    'players': [player1, player2],
                    'game_channel': self.game_channel,
                    'game_serialized': game_serialized,
                }
            )
            asyncio.create_task(self.update_ball_loop(self.game_channel))

    async def colletion(self, player, ball):
        topBall  = ball.y - ball.radius
        topPadd = player.y
        
        leftBall = ball.x - ball.radius
        leftPadd = player.x
        
        rightBall = ball.x + ball.radius
        rightPadd = player.x + player.width
        
        bottomBall = ball.y + ball.radius
        bottomPadd = player.y + player.height
        return (topBall < bottomPadd and leftBall < rightPadd and rightBall > leftPadd and bottomBall > topPadd)
    
    async def handleCollision(self, player, ball):
        colPoint = ball.x - (player.x + player.width/2)
        colPoint = colPoint / (player.width/2)
        angle = colPoint * (math.pi /4)
        direc = 1 if ball.y < 0.5 else -1
        
        ball.directionY = direc * ball.speed * math.cos(angle)
        ball.directionX = ball.speed * math.sin(angle)
        
    async def update_ball_loop(self, game_channel):
        await asyncio.sleep(3)
        while True:
            if game_channel in self.games:
                self.games[game_channel]['ball'].x += self.games[game_channel]['ball'].directionX
                self.games[game_channel]['ball'].y += self.games[game_channel]['ball'].directionY
                if await self.colletion(self.games[game_channel]['player1'], self.games[game_channel]['ball']):
                    await self.handleCollision(self.games[game_channel]['player1'], self.games[game_channel]['ball'])
                if await self.colletion(self.games[game_channel]['player2'], self.games[game_channel]['ball']):
                    await self.handleCollision(self.games[game_channel]['player2'], self.games[game_channel]['ball'])
                if self.games[game_channel]['ball'].x <= 0:
                    self.games[game_channel]['ball'].x = 0
                    self.games[game_channel]['ball'].directionX *= -1
                if self.games[game_channel]['ball'].x + self.games[game_channel]['ball'].radius >= 1:
                    self.games[game_channel]['ball'].x = 1 - self.games[game_channel]['ball'].radius
                    self.games[game_channel]['ball'].directionX *= -1
                if self.games[game_channel]['ball'].y <= 0:
                    self.games[game_channel]['ball'].directionX = 0
                    self.games[game_channel]['ball'].y = 0.5
                    self.games[game_channel]['ball'].x = 0.5
                    self.games[game_channel]['ball'].directionY *= -1
                    self.games[game_channel]['player1'].score += 1
                    if self.games[game_channel]['player1'].score == 6:
                        winer = self.games[game_channel]['player1']
                        loser = self.games[game_channel]['player2']
                        Tscore = winer.score - loser.score
                        await self.gameOver(game_channel, winer.username, loser.username, winer.chan_name, loser.chan_name, Tscore)
                        break
                if self.games[game_channel]['ball'].y >= 1:
                    self.games[game_channel]['ball'].directionX = 0
                    self.games[game_channel]['ball'].y = 0.5
                    self.games[game_channel]['ball'].x = 0.5
                    self.games[game_channel]['ball'].directionY *= -1
                    self.games[game_channel]['player2'].score += 1
                    if self.games[game_channel]['player2'].score == 6:
                        winer = self.games[game_channel]['player2']
                        loser = self.games[game_channel]['player1']
                        Tscore = winer.score - loser.score
                        await self.gameOver(game_channel, winer.username, loser.username, winer.chan_name, loser.chan_name, Tscore)
                        break
                await self.channel_layer.group_send(
                    game_channel,
                    {
                        'type': 'update_ball',
                        'ball': self.games[game_channel]['ball'].to_dict(),
                        'player1': self.games[game_channel]['player1'].to_dict(),
                        'player2': self.games[game_channel]['player2'].to_dict()
                    }
                )
                await asyncio.sleep(1/40)
    
    
    async def gameOver(self, game_chan ,winer, loser, chan_name1, chan_name2, Tscore):
        await self.top_score(winer, Tscore)
        await self.update_winner(winer)
        await self.update_loser(loser)
        await self.channel_layer.group_send(
            game_chan,
            {
                'type': 'game_over',
                'winner': winer
            }
        )
        await self.channel_layer.group_discard(
            game_chan,
            chan_name1
        )
        await self.channel_layer.group_discard(
            game_chan,
            chan_name2
        )
        del self.games[game_chan]
        
    
    async def start_game(self, event):
        await self.send(text_data=json.dumps({
            'type': 'start_game',
            'players': event['players'],
            'game_channel': event['game_channel'],
            'game_serialized': event['game_serialized']
        }))
    

    async def paddle_update(self, event):
        paddle_data = event['paddle']
        playernumber = event['playernumber']
        await self.send(text_data=json.dumps({
            'type': 'paddle_update',
            'paddle': paddle_data,
            'playernumber': playernumber
        }))
        
    async def update_ball(self, event):
        ball_data = event['ball']
        await self.send(text_data=json.dumps({
            'type': 'update_ball',
            'ball': ball_data,
            'player1': event['player1'],
            'player2': event['player2']
        }))
        

    async def game_over(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_over',
            'winner': event['winner']
        }))
    
    
    @sync_to_async
    def create_player(self, username):
        Player.objects.create(
                username=username,
                wins=0,
                loses=0,
                topScore=0,
                currentXP=0,
                matchCount=0,
                tournamentCount=0,
                is_active=True
            )


    @sync_to_async
    def update_matchCount(self, username):
        player = Player.objects.get(username=username)
        player.matchCount += 1
        player.save()
        
    @sync_to_async
    def update_winner(self, username):
        player = Player.objects.get(username=username)
        player.wins += 1
        player.save()
        
    @sync_to_async
    def update_loser(self, username):
        player = Player.objects.get(username=username)
        player.loses += 1
        player.save()

    @sync_to_async
    def top_score(self, username, score):
        player = Player.objects.get(username=username)
        if player.topScore < score:
            player.topScore = score
            player.save()
    