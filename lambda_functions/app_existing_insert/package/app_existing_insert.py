from flask import Flask, request, jsonify
from flask_restful import Api, Resource
import pymysql
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

class InsertRegistrationData(Resource):
    def post(self):
        connection = None
        try:
            data = request.get_json()

            # Extract required fields from the data
            identificationNumber = data.get('identificationNumber')
            firstName = data.get('firstName')
            lastName = data.get('lastName')
            preferredPronouns = data.get('preferredPronouns')
            chiefComplaints = data.get('chiefComplaints')

            # Validate required fields
            if not identificationNumber or not firstName or not lastName or not chiefComplaints:
                return jsonify({'statusCode': 400, 'message': 'Missing required registration fields'})

            connection = connect_db()
            with connection.cursor() as cursor:
                try:
                    # Insert data into registration table
                    sql_insert_registration = """
                        INSERT INTO emergency_registration (
                        identificationNumber, firstName, lastName, preferredPronouns, chiefComplaints
                        )
                        VALUES (%s, %s, %s, %s, %s)
                    """
                    cursor.execute(sql_insert_registration, (identificationNumber, firstName, lastName, preferredPronouns, chiefComplaints))
                    connection.commit()

                    # Get the last inserted registrationId
                    registrationId = cursor.lastrowid

                    return jsonify({'message': 'Registration data inserted successfully', 'registrationId': registrationId})

                except pymysql.Error as e:
                    if e.args[0] == 1205:
                        # Retry logic
                        for attempt in range(3):
                            try:
                                # Repeat the database operations
                                cursor.execute(sql_insert_registration, (identificationNumber, firstName, lastName, preferredPronouns, chiefComplaints))
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

api.add_resource(InsertRegistrationData, '/Insert-Registration-Data')

def lambda_handler(event, context):
    return aws_serverless_wsgi.handle_request(app, event, context)
