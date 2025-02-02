import pymssql
import pyodbc


# Uses GlobalConnextion and sets environment specific db_Context.
class ApplicationDB:
    server:str
    user:str
    password:str
    database:str

    def __init__(self,server: str, user: str,password: str,database: str):
        self.server = server
        self.user = user
        self.password = password
        self.database = database
        
    def applicationDB_conn_obj(self,server,user,password,database):
        # Create a connection string
        connection_string = f"Driver={{ODBC Driver 17 for SQL Server}};Server={self.server};Database={self.database};Uid={self.user};Pwd={self.password};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;"

        # Connect to the database
        return pyodbc.connect(connection_string)
        # return pymssql.connect(server=server, user=user, password=password, database=database)
    
    def run_query(self, query):
        conn = self.applicationDB_conn_obj(self.server,
                                           self.user,
                                           self.password,
                                           self.database)
        try:
            cursor = conn.cursor()
            cursor.execute(query)
            if "UPDATE" in query.upper() or "INSERT" in query.upper() or "DELETE" in query.upper():
                # If the executed query is an update query, return an empty list
                result = []
                print("Query ran successfully")
            else:    
                result = cursor.fetchall()
            conn.commit()

        except Exception as e:
            print(f"Error occurred while executing query: {e}")
            result = []

        finally:
            columnDescription = cursor.description
            if 'cursor' in locals():
                cursor.close()
            if 'conn' in locals():
                conn.close()

        return [dict(zip([column[0] for column in columnDescription], row)) for row in result]
