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

@app.route('/app_new_reg', methods=['POST'])
def new_patient_registration():
    try:
        data = request.get_json()

        # Extract parent and address data
        identificationNumber = data.get('identificationNumber')
        identificationType = data.get('identificationType')
        firstName = data.get('firstName')
        lastName = data.get('lastName')
        dateOfBirth = data.get('dateOfBirth')
        biologicalSex = data.get('biologicalSex')
        preferredPronouns = data.get('preferredPronouns')
        phoneNumber = data.get('phoneNumber')
        email = data.get('email')
        address = data.get('address')
        emergencyContactName = data.get('emergencyContactName')
        emergencyContactNumber = data.get('emergencyContactNumber')
        medicalHistory = data.get('medicalHistory')
        drugHistory = data.get('drugHistory')
        chiefComplaints = data.get('chiefComplaints')

        # Validate required fields
        required_fields = [
            'identificationNumber', 'identificationType', 'firstName', 'lastName',
            'dateOfBirth', 'biologicalSex', 'preferredPronouns', 'email',
            'phoneNumber', 'address', 'chiefComplaints'
        ]
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({'statusCode': 400, 'message': f'Missing required fields: {", ".join(missing_fields)}'}), 400

        connection = connect_db()
        with connection:
            with connection.cursor() as cursor:
                # Check if patient already exists
                cursor.execute("SELECT COUNT(*) as count FROM patient_info WHERE identificationNumber = %s", (identificationNumber,))
                result = cursor.fetchone()
                if result['count'] > 0:
                    return jsonify({'message': 'Patient already exists'}), 409

                # Insert patient's data into patient_info
                sql_patient_info = """
                    INSERT INTO patient_info (
                    identificationNumber, identificationType, firstName, lastName, dateOfBirth, biologicalSex, preferredPronouns, phoneNumber, email, address, 
                    emergencyContactName, emergencyContactNumber, medicalHistory, drugHistory
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(sql_patient_info, (identificationNumber, identificationType, firstName, lastName, dateOfBirth, biologicalSex, preferredPronouns, phoneNumber,
                                                  email, address, emergencyContactName, emergencyContactNumber, medicalHistory, drugHistory))
                connection.commit()

                # Insert data into emergency_registration
                sql_emergency_registration = """
                    INSERT INTO emergency_registration (
                    identificationNumber, firstName, lastName, preferredPronouns, chiefComplaints
                    )
                    VALUES (%s, %s, %s, %s, %s)
                """
                cursor.execute(sql_emergency_registration, (identificationNumber, firstName, lastName, preferredPronouns, chiefComplaints))
                connection.commit()

                # Get the last inserted registrationId
                registrationId = cursor.lastrowid

                return jsonify({'message': 'Patient registered successfully', 'registrationId': registrationId}), 201

    except pymysql.MySQLError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
