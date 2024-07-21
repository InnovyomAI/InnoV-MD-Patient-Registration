from flask import Flask, request, jsonify
from flask_restful import Api, Resource
import pymysql
import json

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

class NewPatientRegistration(Resource):
    def post(self):
        connection = None
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
            if not identificationNumber or not identificationType or not firstName or not lastName or not dateOfBirth or not biologicalSex or not preferredPronouns or not email or not phoneNumber or not address or not chiefComplaints:
                return jsonify({'statusCode': 400, 'message': 'Missing required address fields'})

            connection = connect_db()
            with connection.cursor() as cursor:
                try:
                    # Check if patient already exists
                    cursor.execute("SELECT COUNT(*) as count FROM patient_info WHERE identificationNumber = %s", (identificationNumber,))
                    result = cursor.fetchone()
                    if result['count'] > 0:
                        return jsonify({'message': 'Patient already exists'})

                    # Insert patient's data into patient_info
                    sql_patient_info = """
                        INSERT INTO patient_info (
                        identificationNumber, identificationType, firstName, lastName, dateOfBirth,  biologicalSex, preferredPronouns, phoneNumber, email, address, 
                        emergencyContactName, emergencyContactNumber, medicalHistory, drugHistory
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    cursor.execute(sql_patient_info, (identificationNumber, identificationType, firstName, lastName, dateOfBirth,  biologicalSex, preferredPronouns, phoneNumber,
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

                    return jsonify({'message': 'Patient registered successfully', 'registrationId': registrationId})


                except pymysql.Error as e:
                    if e.args[0] == 1205:
                        # Retry logic
                        for attempt in range(3):
                            try:
                                # Repeat the database operations
                                cursor.execute(sql_patient_info, (identificationNumber, identificationType, firstName, lastName, dateOfBirth,  biologicalSex, preferredPronouns, phoneNumber,
                                                      email, address, emergencyContactName, emergencyContactNumber, medicalHistory, drugHistory))
                                connection.commit()

                                cursor.execute(sql_emergency_registration, (identificationNumber, firstName, lastName, preferredPronouns, chiefComplaints))
                                connection.commit()

                                return jsonify({'message': 'Patient data inserted successfully'})
                            except pymysql.Error as retry_error:
                                continue
                    else:
                        return jsonify({"error": str(e)})
        except Exception as e:
            return jsonify({"error": str(e)})
        finally:
            if connection:
                connection.close()

api.add_resource(NewPatientRegistration, '/New-Patient-Registration')

if __name__ == '_main_':
    app.run(debug=True)
