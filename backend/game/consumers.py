import json
from channels.generic.websocket import AsyncWebsocketConsumer



class Game(AsyncWebsocketConsumer):

    all_game = []

    async def connect(self):
        await self.accept()
        
    async def disconnect(self, close_code):
        pass
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        if message == 'connection':
            player = text_data_json['player']
            username = player['username']
            game_is_exist = False
            for game in self.all_game:
                if game['player2'] == None:
                    player['player_id'] = "2"
                    game['player2'] = player
                    game_channel = f'{game["player1"]["username"]}vs{game["player2"]["username"]}'
                    game['player1']['game_channel'] = game_channel
                    game['player2']['game_channel'] = game_channel
                    await self.channel_layer.group_add(game_channel,self.channel_name)
                    await self.channel_layer.group_add(game_channel,game['player1']['self_channel'])
                    game_is_exist = True
                    await self.send(text_data=json.dumps({
                        'message': 'connection',
                        'player': player,
                    }))
                    await self.channel_layer.send(game['player1']['self_channel'],
                    {
                        'type': 'player_connected',
                        'game_channel': game_channel,
                    })
                    return

            if not game_is_exist:
                player['player_id'] = "1"
                player['self_channel'] = self.channel_name
                self.all_game.append({
                    'player1': player,
                    'player2': None,
                })
                await self.send(text_data=json.dumps({
                    'message': 'connection',
                    'player': player
                }))
        elif message == 'move':
            player = text_data_json['player']
            game_channel = player['game_channel']
            print(player)
            await self.channel_layer.group_send(game_channel, {
                'type': 'move',
                'player': player,
            })

    

    async def player_connected(self, event):
        game_channel = event['game_channel']
        await self.send(text_data=json.dumps({
            'type': 'player_connected',
            'game_channel': game_channel,
        }))

    async def move(self, event):
        player = event['player']
        await self.send(text_data=json.dumps({
            'type': 'move',
            'player': player,
        }))