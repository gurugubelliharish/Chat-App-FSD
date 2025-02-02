from azure.identity import ChainedTokenCredential, ManagedIdentityCredential, ClientSecretCredential, DefaultAzureCredential, VisualStudioCodeCredential
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import pyarrow as pa
import pandas as pd

class AzureStorageService:
    connect_str = 'DefaultEndpointsProtocol=https;AccountName=chatlogs3366;AccountKey=1LxgibJROWSAvQzXCcszXmBjFPnHtBp7MrskWtSpTsFyaupECCfqDgHeUyQoE6nlur9JXWzGemaZ+AStbe8Jug==;EndpointSuffix=core.windows.net'
    def SetContainer(self, account_name:str, container_name:str) -> None:
        self.container_name = container_name
        self.account_name = account_name
        pass

    def ReadBlob(self,blob_name):
        try:
            blob_service_client = BlobServiceClient.from_connection_string(self.connect_str)
            container_client = blob_service_client.get_container_client(self.container_name)
            blob_client = container_client.get_blob_client(blob_name)
            stream = blob_client.download_blob().readall()
            return stream
        except Exception as e:
            print(blob_name)
            print(e)
    
    def WriteBlob(self,blob_name,data):
        try:
            blob_service_client = BlobServiceClient.from_connection_string(self.connect_str)
            container_client = blob_service_client.get_container_client(self.container_name)
            blob_client = container_client.get_blob_client(blob_name)
            blob_client.upload_blob(data)
        except Exception as e:
            print(blob_name)
            print(e)
    
    def Get_Flat_File_As_DataFrame(self,blob_name:str,delimeter:str) -> pd.DataFrame:
        url = f'az://{self.container_name}/{blob_name}'
        storage_account_details = {
            "account_name": self.account_name,
            "client_id" : self.client_id,
            "client_secret" : self.client_secret,
            "tenant_id" : self.tenant_id
        }
        parquet_df = pd.read_parquet(url, storage_options=storage_account_details)      
        return parquet_df
    



