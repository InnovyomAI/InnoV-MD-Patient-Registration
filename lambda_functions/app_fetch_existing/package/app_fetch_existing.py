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

@app.route('/fetch_patient_data', methods=['POST'])
def fetch_patient_data():
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

def lambda_handler(event, context):
    # Log the incoming event for debugging
    print("Received event: %s", json.dumps(event))

    try:
        # Log specific parts of the event object for debugging
        print("Request context: %s", event.get('requestContext'))
        print("HTTP details: %s", event.get('requestContext', {}).get('http'))

        # Pass the event directly to aws_wsgi
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
