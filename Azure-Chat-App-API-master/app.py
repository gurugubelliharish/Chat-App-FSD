import os
from msal import ConfidentialClientApplication
from flask import *
from flask_cors import CORS, cross_origin
from common.appDb import ApplicationDB
from common.storageService import AzureStorageService
import uuid

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_ORIGINS'] = ['http://localhost:3000',
                              'https://azure-chat-app-ux.azurewebsites.net', 'https://azure-chat-app.azurewebsites.net']

_appDb = ApplicationDB(server="tcp:chat-app-db.database.windows.net,1433",
                       user="chatadmin",
                       password="!)@(#*chatApp123",
                       database="chat-app-db")

_storage = AzureStorageService()
_storage.SetContainer(account_name="chatlogs3366", container_name="chatstream")

# Azure AD credentials
tenant_id = 'b42ed05a-7785-4289-960b-e092a37b2ff5'
client_id = '8f01e660-dbe2-4ac3-9987-6c7c896bb27c'
client_secret = 'VdQ8Q~KwPXxChc8pFNzlLq0BGTHpMmzpId2exbxM'
scope = ['api://8f01e660-dbe2-4ac3-9987-6c7c896bb27c/.default']

# Create a ConfidentialClientApplication instance
clientApp = ConfidentialClientApplication(
    client_id=client_id,
    client_credential=client_secret,
    authority=f'https://login.microsoftonline.com/{tenant_id}'
)

# Acquire an access token
access_token = clientApp.acquire_token_for_client(scopes=scope)

@app.route('/')
def index():
    # Extract the access token from the result
    if 'access_token' in access_token:
        print('Request for index page received')
        print(access_token)
        return "Application Authorized"
    else:
        return "Application Authorization Failed..!"


@app.route("/login", methods=['POST', 'OPTIONS'])
@cross_origin()
def login():
    userName = request.json["username"]
    password = request.json["password"]
    result = _appDb.run_query(
        f"select * from users where userName = '{userName}' and password = '{password}'")
    if (len(result) > 0):
        return jsonify(result[0])
    else:
        return jsonify("")


@app.route("/register", methods=['POST', 'OPTIONS'])
@cross_origin()
def register():
    id = uuid.uuid4()
    userName = request.json["username"]
    password = request.json["password"]
    name = request.json["name"]
    number = request.json["number"]

    result = _appDb.run_query(
        f"insert into users values('{id}','{userName}','{password}','{name}','{number}')")
    return jsonify("Regestered Successfully")

@app.route("/users", methods=['POST', 'OPTIONS'])
@cross_origin()
def users_list():
    sender = request.json["sender"]
    # Extract the access token from the result
    if 'access_token' in access_token:
        print('Request for index page received')
        print(access_token["access_token"])
        return _appDb.run_query(f"select * from users where id <> '{sender}'")
    else:
        return "Application Authorization Failed..!"

@app.route("/newchat", methods=['POST', 'OPTIONS'])
@cross_origin()
def new_chat():
    sender = request.json["sender"]
    receiver = request.json["receiver"]
    result = _appDb.run_query(f"select * from chatLogs where (sender = '{sender}' and receiver = '{receiver}') or (sender = '{receiver}' and receiver = '{sender}') ")
    if(len(result)==0):_appDb.run_query(f"insert into chatLogs values('{sender}','{receiver}',null)")
    return result

@app.route("/chats", methods=['POST', 'OPTIONS'])
@cross_origin()
def get_chats():
    sender = request.json["sender"]
    chats = _appDb.run_query(f"select * from chatlogs where sender = '{sender}'")
    where = "','".join([chat["receiver"] for chat in chats])
    chats = _appDb.run_query(f"select * from chatlogs where receiver = '{sender}'")
    where += "','".join([chat["sender"] for chat in chats])
    result = _appDb.run_query(f"select * from users where id in ('{where}')")
    return result

@app.route("/getmessages", methods=['POST', 'OPTIONS'])
@cross_origin()
def get_messages():
    receiver = request.json["sender"]
    sender = request.json["receiver"]
    messages = _appDb.run_query(f"select * from chatlogs where sender in ('{sender}','{receiver}') and receiver  in ('{sender}','{receiver}')")
    result = []
    for messages1 in messages:
        if(messages1["message_list"]):
            for message in messages1["message_list"].split(","):
                print(message)
                if ":|" in message.split("::")[1]:
                    video = _storage.ReadBlob(message.split("::")[1]).decode('utf-8')
                    user = message.split("::")[0]
                    result.append(f"{user}::||{video}")
                elif ":" in message.split("::")[1]:
                    image = _storage.ReadBlob(message.split("::")[1]).decode('utf-8')
                    user = message.split("::")[0]
                    result.append(f"{user}::|{image}")
                else:
                    result.append(message)
    return result

@app.route("/messages", methods=['POST','OPTIONS'])
@cross_origin()
def set_messages():
    sender = request.json["sender"]
    receiver = request.json["receiver"]
    messageInput = request.json["message"]
    image = request.json["image"]
    video = request.json["video"]
    if(image):
        blob_name = f"{sender}:{uuid.uuid4()}"
        _storage.WriteBlob(blob_name,image)
    if(video):
        blob_name = f"{sender}:|{uuid.uuid4()}"
        _storage.WriteBlob(blob_name,video)
    messages = _appDb.run_query(f"select * from chatlogs where sender in ('{sender}','{receiver}') and receiver in ('{sender}','{receiver}')")
    result = []
    for messages1 in messages:
        if(messages1["message_list"]):
            for message in messages1["message_list"].split(","):
                print(message)
                result.append(message)
    if(image or video):result.append(f"{sender}::{blob_name}")
    else:result.append(f"{sender}::{messageInput}")
    messageOutput = ",".join(result)
    _appDb.run_query(f"update chatlogs set message_list = '{messageOutput}' where sender in ('{sender}','{receiver}') and receiver in ('{sender}','{receiver}')")
    if(image):result[-1] = f"{sender}::|{image}"
    if(video):result[-1] = f"{sender}::||{video}"
    return result

@app.route("/deleteChat", methods=['POST','OPTIONS'])
@cross_origin()
def delete_message():
    sender = request.json["sender"]
    receiver = request.json["receiver"]
    _appDb.run_query(f"delete chatlogs where sender in ('{sender}','{receiver}') and receiver in ('{sender}','{receiver}')")
    return "deleted"

@app.route('/hello')
def _hello():
    return "Welcome to app"

if __name__ == '__main__':
    # app.run(host='localhost', port=5000)
    app.run()

