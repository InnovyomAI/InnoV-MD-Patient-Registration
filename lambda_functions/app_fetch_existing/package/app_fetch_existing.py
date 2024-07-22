from flask import Flask, request, jsonify
from flask_restful import Api, Resource
import pymysql
import json
import aws_serverless_wsgi

app = Flask(__name__)
api = Api(app)

# Database connection
def connect_db():
    return pymysql.connect(
        host='innovmd.ctyqcs8asp1j.us-east-1.rds.amazonaws.com',
        user='admin',
        password='innov-md123',
        db='innovmd',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

class FetchPatientData(Resource):
    def post(self):
        connection = None
        try:
            data = request.get_json()

            # Extract parent and address data
            identificationNumber = data.get('identificationNumber')
            identificationType = data.get('identificationType')

            # Validate required fields
            if not identificationNumber or not identificationType:
                return jsonify({'statusCode': 400, 'message': 'Missing required address fields'})

            connection = connect_db()
            with connection.cursor() as cursor:
                try:
                    # Retrieve patient's data
                    sql_select = """
                        SELECT * FROM patient_info
                        WHERE identificationNumber = %s AND identificationType = %s
                    """
                    cursor.execute(sql_select, (identificationNumber, identificationType))
                    result = cursor.fetchone()
                    
                    if not result:
                        return jsonify({'message': 'Patient not found'})

                    return jsonify({'statusCode': 200, 'data': result})

                except pymysql.Error as e:
                    if e.args[0] == 1205:
                        # Retry logic
                        for attempt in range(3):
                            try:
                                # Repeat the database operations
                                cursor.execute(sql_select, (identificationNumber, identificationType))
                                result = cursor.fetchone()
                    
                                if not result:
                                    return jsonify({'message': 'Patient not found'})

                                return jsonify({'statusCode': 200, 'data': result})
                            except pymysql.Error as retry_error:
                                continue
                    else:
                        return jsonify({"error": str(e)})
        except Exception as e:
            return jsonify({"error": str(e)})
        finally:
            if connection:
                connection.close()

api.add_resource(FetchPatientData, '/Fetch-Patient-Data')

def lambda_handler(event, context):
    return aws_serverless_wsgi.handle_request(app, event, context)
