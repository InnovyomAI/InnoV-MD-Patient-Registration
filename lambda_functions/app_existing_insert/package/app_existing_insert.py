import awsgi
from flask import Flask, request, jsonify
import pymysql
import json
import logging

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)

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

@app.route('/insert_registration_data', methods=['POST'])
def insert_registration_data():
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
                            connection.commit()
                            registrationId = cursor.lastrowid
                            return jsonify({'message': 'Registration data inserted successfully', 'registrationId': registrationId})
                        except pymysql.Error as retry_error:
                            continue
                else:
                    return jsonify({"error": str(e)})
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        if connection:
            connection.close()

def lambda_handler(event, context):
    # Log the incoming event for debugging
    print("Received event: %s", json.dumps(event))

    try:
        # Log specific parts of the event object for debugging
        print("Request context: %s", event.get('requestContext'))
        print("HTTP details: %s", event.get('requestContext', {}).get('http'))

        # Pass the event directly to awsgi
        return awsgi.response(app, event, context)
    except KeyError as e:
        logging.error("KeyError: %s", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Internal server error',
                'message': f'Missing key in event object: {str(e)}'
            })
        }
    except Exception as e:
        logging.error("Exception: %s", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }

if __name__ == "__main__":
    app.run(debug=True)
