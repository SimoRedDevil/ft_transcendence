import json
import math
import asyncio
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from authentication.models import CustomUser


class paddles:
    def __init__(self, x, y,width, height, speed, color, chan_name, playerNu, username, N_tour):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.color = color
        self.speed = speed
        self.chan_name = chan_name
        self.username = username
        self.playerNu = playerNu
        self.playernambertour = N_tour
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
            'playernambertour': self.playernambertour,
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

class Tournament(AsyncWebsocketConsumer):

    players = []
    Tournaments = {}
    tour_players = []
    players_tournament = []
    match1 = {}
    match2 = {}
    final_match = {}
    players_final = {}
    paddles = {}
    games = {}
    Ball = {}
    
    async def connect(self):
        await self.accept()
        self.player = None
        self.game_channel = None
        self.group_name_tournament = ""
        
        
    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == 'connection':
            User = await self.get_user(self.scope["user"])
            print(data) 
            if not any(player['name'] == data['playerName'] for player in self.players):
                self.player = {
                    'name': data['playerName'],
                    'usernameDB': data['username'], 
                    'id': self.channel_name,
                    'image': User.avatar_url,
                    'player_id': '',
                    'numberplayer': '',
                    'group_name': ''
                }
                
                self.players.append(self.player)
                self.players_tournament.append(self.player)
                if len(self.players_tournament) % 2 != 0:
                    self.player['player_id'] = 'player1'
                else:
                    self.player['player_id'] = 'player2'
                self.player['numberplayer'] = f'player{len(self.players_tournament)}'
                await self.send(text_data=json.dumps({
                    'type': 'connection',
                    'message': 'User connected',
                    'player': self.player
                }))
                if len(self.players_tournament) >= 4:
                    for player in self.players_tournament:
                        self.group_name_tournament += f'{player["name"]}'
                    for _ in range(4):
                        player = self.players_tournament.pop(0)
                        Tournament.tour_players.append(player)
                        player['group_name'] = self.group_name_tournament
                        await self.channel_layer.group_add(
                            self.group_name_tournament,  
                            player['id']
                        )
                    Tournament.Tournaments[self.group_name_tournament] = self.tour_players
                    await self.channel_layer.group_send(
                        self.group_name_tournament,  
                        {
                            'type': 'tournament_start',
                            'players': self.tour_players
                        }
                    )
                    """"
                        self.tour_players[0]['usernameDB'] play with self.tour_players[1]['usernameDB']
                        self.tour_players[2]['usernameDB'] play with self.tour_players[3]['usernameDB']
                    """
                    self.tour_players.clear()
            else:
                await self.send(text_data=json.dumps({
                    'type': 'connection',
                    'message': 'player_exist',
                    'player': data['playerName']
                }))
            
        if data['type'] == 'move':
            game_channel = data['game_channel']
            player_id = self.player['player_id']
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
                        'playernumber': self.games[game_channel][player_id].playerNu,
                    }
                )
        if data['type'] == 'qualified':
            if data['groupname'] not in self.players_final:
                self.players_final[data['groupname']] = []
            self.players_final[data['groupname']].append(data['data'])
            if data['final_tournament'] == True:
                await self.channel_layer.group_send(
                    data['groupname'],
                    {
                        'type': 'update_state',
                        'players': data['data'],
                        'final_tournament': True
                    }
                )
            elif len(self.players_final[data['groupname']]) == 2:
                await self.channel_layer.group_send(
                    data['groupname'],
                    {
                        'type': 'update_state',
                        'players': self.players_final[data['groupname']],
                        'final_tournament': False
                    }
                )
    
        if data['type'] == 'match_tour':
            if data['data']['playerNumber'] == 'player1' or data['data']['playerNumber'] == 'player2':
                if data['data']['groupname'] not in self.match1:
                    self.match1[data['data']['groupname']] = []
                self.match1[data['data']['groupname']].append(data['data'])
                if len(self.match1[data['data']['groupname']]) == 2:
                    match_name = f"{self.match1[data['data']['groupname']][0]['username']}vs{self.match1[data['data']['groupname']][1]['username']}"
                    await self.channel_layer.group_add(
                        match_name,
                        self.match1[data['data']['groupname']][0]['id_channel']
                    )
                    await self.channel_layer.group_add(
                        match_name,
                        self.match1[data['data']['groupname']][1]['id_channel']
                    )
                    if data['data']['playerNumber'] == 'player1':
                        player1 = self.match1[data['data']['groupname']][1]
                        player2 = self.match1[data['data']['groupname']][0]
                    else:
                        player1 = self.match1[data['data']['groupname']][0]
                        player2 = self.match1[data['data']['groupname']][1]
                    self.paddles['player1'] = paddles(data['data']['x'],data['data']['y1'], data['data']['pw'], data['data']['ph'] ,data['data']['sp'], 'white', player1['id_channel'], 1, player1['username'], player1['playerNumber'])
                    self.paddles['player2'] = paddles(data['data']['x'],data['data']['y2'],data['data']['pw'], data['data']['ph'], data['data']['sp'], 'white', player2['id_channel'], 2, player2['username'], player2['playerNumber'])
                    self.Ball = ball(0.5, 0.5, data['data']['Walls']['wallsHeight']/25/2/data['data']['Walls']['wallsHeight'], data['data']['dirY'], data['data']['sp'] ,'white')
                    self.games[match_name] = {
                        'player1' : self.paddles['player1'],
                        'player2' : self.paddles['player2'],
                        'ball' : self.Ball,
                    }
                    game_serialized = {
                        'player1': self.games[match_name]['player1'].to_dict(),
                        'player2': self.games[match_name]['player2'].to_dict(),
                        'ball': self.games[match_name]['ball'].to_dict()
                    }
                    await self.channel_layer.group_send(
                        match_name,
                        {
                            'type': 'start_game',
                            'players': [player1, player2],
                            'name_channel': match_name,
                            'game_serialized': game_serialized,  
                        }
                    )
                    asyncio.create_task(self.update_ball_loop(match_name, False))
            if data['data']['playerNumber'] == 'player3' or data['data']['playerNumber'] == 'player4':
                if data['data']['groupname'] not in self.match2:
                    self.match2[data['data']['groupname']] = []
                self.match2[data['data']['groupname']].append(data['data'])
                if len(self.match2[data['data']['groupname']]) == 2:
                    match_name = f"{self.match2[data['data']['groupname']][0]['username']}vs{self.match2[data['data']['groupname']][1]['username']}"
                    await self.channel_layer.group_add(
                        match_name,
                        self.match2[data['data']['groupname']][0]['id_channel']
                    )
                    await self.channel_layer.group_add(
                        match_name,
                        self.match2[data['data']['groupname']][1]['id_channel']
                    )
                    if data['data']['playerNumber'] == 'player4':
                        player1 = self.match2[data['data']['groupname']][0]
                        player2 = self.match2[data['data']['groupname']][1]
                    else:
                        player1 = self.match2[data['data']['groupname']][1]
                        player2 = self.match2[data['data']['groupname']][0]
                    self.paddles['player1'] = paddles(data['data']['x'],data['data']['y1'], data['data']['pw'], data['data']['ph'] ,data['data']['sp'], 'white', player1['id_channel'], 1, player1['username'], player1['playerNumber'])
                    self.paddles['player2'] = paddles(data['data']['x'],data['data']['y2'],data['data']['pw'], data['data']['ph'], data['data']['sp'], 'white', player2['id_channel'], 2, player2['username'], player2['playerNumber'])
                    self.Ball = ball(0.5, 0.5, data['data']['Walls']['wallsHeight']/25/2/data['data']['Walls']['wallsHeight'], data['data']['dirY'], data['data']['sp'] ,'white')
                    self.games[match_name] = {
                        'player1' : self.paddles['player1'],
                        'player2' : self.paddles['player2'],
                        'ball' : self.Ball,
                    } 
                    game_serialized = {
                        'player1': self.games[match_name]['player1'].to_dict(),
                        'player2': self.games[match_name]['player2'].to_dict(),
                        'ball': self.games[match_name]['ball'].to_dict()
                    }
                    await self.channel_layer.group_send(
                        match_name,
                        {
                            'type': 'start_game',
                            'players': [player1, player2],
                            'name_channel': match_name,
                            'game_serialized': game_serialized,
                        }
                    )
                    asyncio.create_task(self.update_ball_loop(match_name, False))
            if data['data']['qualified'] == True: 
                if data['data']['groupname'] not in self.final_match:
                    self.final_match[data['data']['groupname']] = []
                self.final_match[data['data']['groupname']].append(data['data'])
                if len(self.final_match[data['data']['groupname']]) == 2:
                    match_name = f"{self.final_match[data['data']['groupname']][0]['username']}vs{self.final_match[data['data']['groupname']][1]['username']}"
                    await self.channel_layer.group_add(
                        match_name,
                        self.final_match[data['data']['groupname']][0]['id_channel']
                    )
                    await self.channel_layer.group_add(
                        match_name,
                        self.final_match[data['data']['groupname']][1]['id_channel']
                    )
                    if data['data']['playerNumber'] == 'player4' or data['data']['playerNumber'] == 'player3':
                        player1 = self.final_match[data['data']['groupname']][0]
                        player2 = self.final_match[data['data']['groupname']][1]
                        self.player['player_id'] = 'player2'
                    else:
                        player1 = self.final_match[data['data']['groupname']][1]
                        player2 = self.final_match[data['data']['groupname']][0]
                        self.player['player_id'] = 'player1'
                    self.paddles['player1'] = paddles(data['data']['x'],data['data']['y1'], data['data']['pw'], data['data']['ph'] ,data['data']['sp'], 'white', player1['id_channel'], 1, player1['username'], player1['playerNumber'])
                    self.paddles['player2'] = paddles(data['data']['x'],data['data']['y2'],data['data']['pw'], data['data']['ph'], data['data']['sp'], 'white', player2['id_channel'], 2, player2['username'], player2['playerNumber'])
                    self.Ball = ball(0.5, 0.5, data['data']['Walls']['wallsHeight']/25/2/data['data']['Walls']['wallsHeight'], data['data']['dirY'], data['data']['sp'] ,'white')
                    self.games[match_name] = {
                        'player1' : self.paddles['player1'],
                        'player2' : self.paddles['player2'],
                        'ball' : self.Ball,
                    }
                    game_serialized = {
                        'player1': self.games[match_name]['player1'].to_dict(),
                        'player2': self.games[match_name]['player2'].to_dict(),
                        'ball': self.games[match_name]['ball'].to_dict()
                    }
                    await self.channel_layer.group_send(
                        match_name,
                        {
                            'type': 'start_game',
                            'players': [player1, player2],
                            'name_channel': match_name,
                            'game_serialized': game_serialized,
                        }
                    )
                    asyncio.create_task(self.update_ball_loop(match_name, True))
                    
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
            
    async def start_game(self, event):
        players = event['players']
        name_channel = event['name_channel']
        game_serialized = event['game_serialized']

        await self.send(text_data=json.dumps({
            'type': 'start_game',
            'players': players,
            'name_channel': name_channel,
            'game_serialized': game_serialized,
        }))
        
        
    async def paddle_update(self, event):
        paddle_data = event['paddle']
        playernumber = event['playernumber']
        await self.send(text_data=json.dumps({
            'type': 'paddle_update',
            'paddle': paddle_data,
            'playernumber': playernumber
        }))
        
        



    async def disconnect(self, close_code):
        if self.player in Tournament.players:
            other_player_id = 'player1' if self.player['player_id'] == 'player2' else 'player2'
            game = self.games.get(self.player['group_name'])
            if self.player['group_name'] in self.games:
                await self.channel_layer.group_send(
                    self.player['group_name'],
                    {
                        'type': 'game_over',
                        'group_name': self.player['group_name'],
                        'final_tournament': False,
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
    

    async def tournament_start(self, event):
        await self.send(text_data=json.dumps({
            'type': 'tournament_start',
            'players': event['players']
        }))
    
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
        

    async def update_ball_loop(self, game_channel, final_tournament):
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
                        await self.gameOver(game_channel, winer, final_tournament)
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
                        await self.gameOver(game_channel, winer, final_tournament)
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
  
    async def update_state(self, event):
        await self.send(text_data=json.dumps({
            'type': 'update_state',
            'players': event['players'],
            'final_tournament': event['final_tournament']
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
        
    async def gameOver(self, game_chan ,winer, finTour):
        await self.channel_layer.group_send(
            game_chan,
            {
                'type': 'game_over',
                'final_tournament': finTour,
                'winner': winer.to_dict(),
            }
        )
        
    async def game_over(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_over',
            'final_tournament': event['final_tournament'],
            'winner': event['winner']
        }))
    
    
    
    @sync_to_async
    def get_user(self, username):
        try:
            return CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return None