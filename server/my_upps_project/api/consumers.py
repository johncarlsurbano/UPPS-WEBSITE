import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MyConsumer(AsyncWebsocketConsumer):
    def connect(self):
        self.accept()
        self.send(text_data=json.dumps({
            'message': 'GeeksforGeeks'
        }))
    
    def disconnect(self, close_code):
        pass
    
    def receive(self, text_data):
        pass