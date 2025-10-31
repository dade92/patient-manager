package adapters.patient

import domain.model.Patient
import domain.model.PatientId
import domain.patient.PatientRepository
import java.sql.Date
import java.sql.ResultSet
import java.sql.Timestamp
import java.time.LocalDateTime
import javax.sql.DataSource

class JdbcPatientRepository(
    private val dataSource: DataSource
) : PatientRepository {

    override fun retrieve(patientId: PatientId): Patient? {
        val sql =
            """SELECT
                | $COL_PATIENT_ID, $COL_NAME, $COL_EMAIL, 
                | $COL_PHONE, $COL_ADDRESS, $COL_CITY, $COL_NATIONALITY, 
                | $COL_BIRTH_DATE, $COL_TAX_CODE, $COL_MEDICAL_HISTORY
                | FROM `$TABLE_PATIENT` 
                | WHERE $COL_PATIENT_ID = ?
            """.trimMargin()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, patientId.value)
                statement.executeQuery().use { resultSet ->
                    if (resultSet.next()) {
                        return mapToPatient(resultSet)
                    }
                }
            }
        }

        return null
    }

    override fun save(patient: Patient): Patient {
        val existingPatient = retrieve(patient.id)

        return if (existingPatient == null) {
            insertPatient(patient)
        } else {
            updatePatient(patient)
        }
    }

    override fun searchByName(name: String): List<Patient> {
        val sql =
            """SELECT $COL_PATIENT_ID, $COL_NAME, $COL_EMAIL, $COL_PHONE, $COL_ADDRESS, $COL_CITY, $COL_NATIONALITY, $COL_BIRTH_DATE, $COL_TAX_CODE, $COL_MEDICAL_HISTORY FROM `$TABLE_PATIENT` WHERE $COL_NAME LIKE ?"""
        val patients = mutableListOf<Patient>()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, "%$name%")
                statement.executeQuery().use { resultSet ->
                    while (resultSet.next()) {
                        patients.add(mapToPatient(resultSet))
                    }
                }
            }
        }

        return patients
    }

    override fun delete(patientId: PatientId) {
        TODO("Not yet implemented")
    }

    private fun insertPatient(patient: Patient): Patient {
        val sql = """
            INSERT INTO `$TABLE_PATIENT` (
            | $COL_PATIENT_ID, $COL_NAME, $COL_EMAIL, $COL_PHONE, $COL_ADDRESS, $COL_CITY, $COL_NATIONALITY, $COL_BIRTH_DATE, $COL_TAX_CODE, $COL_CREATION_DATE, $COL_MEDICAL_HISTORY) 
            | VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """.trimMargin()

        val now = LocalDateTime.now()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, patient.id.value)
                statement.setString(2, patient.name)
                statement.setString(3, patient.email)
                statement.setString(4, patient.phoneNumber)
                statement.setString(5, patient.address)
                statement.setString(6, patient.cityOfResidence)
                statement.setString(7, patient.nationality)
                statement.setDate(8, Date.valueOf(patient.birthDate))
                statement.setString(9, patient.taxCode)
                statement.setTimestamp(10, Timestamp.valueOf(now))
                statement.setString(11, patient.medicalHistory)

                statement.executeUpdate()
            }
        }

        return patient
    }

    private fun updatePatient(patient: Patient): Patient {
        val sql = """
            UPDATE `$TABLE_PATIENT` 
            SET $COL_NAME = ?, $COL_EMAIL = ?, $COL_PHONE = ?, $COL_ADDRESS = ?, $COL_CITY = ?, $COL_NATIONALITY = ?, $COL_BIRTH_DATE = ?, $COL_TAX_CODE = ?, $COL_MEDICAL_HISTORY = ? 
            WHERE $COL_PATIENT_ID = ?
        """.trimIndent()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, patient.name)
                statement.setString(2, patient.email)
                statement.setString(3, patient.phoneNumber)
                statement.setString(4, patient.address)
                statement.setString(5, patient.cityOfResidence)
                statement.setString(6, patient.nationality)
                statement.setDate(7, Date.valueOf(patient.birthDate))
                statement.setString(8, patient.taxCode)
                statement.setString(9, patient.medicalHistory)
                statement.setString(10, patient.id.value)

                statement.executeUpdate()
            }
        }

        return patient
    }

    private fun mapToPatient(resultSet: ResultSet): Patient =
        Patient(
            id = PatientId(resultSet.getString(COL_PATIENT_ID)),
            name = resultSet.getString(COL_NAME),
            email = resultSet.getString(COL_EMAIL),
            phoneNumber = resultSet.getString(COL_PHONE),
            address = resultSet.getString(COL_ADDRESS),
            cityOfResidence = resultSet.getString(COL_CITY),
            nationality = resultSet.getString(COL_NATIONALITY),
            birthDate = resultSet.getDate(COL_BIRTH_DATE).toLocalDate(),
            taxCode = resultSet.getString(COL_TAX_CODE),
            medicalHistory = resultSet.getString(COL_MEDICAL_HISTORY)
        )

    private companion object {
        const val TABLE_PATIENT = "PATIENT"
        const val COL_PATIENT_ID = "patient_id"
        const val COL_NAME = "name"
        const val COL_EMAIL = "email"
        const val COL_PHONE = "phone_number"
        const val COL_ADDRESS = "address"
        const val COL_CITY = "city_of_residence"
        const val COL_NATIONALITY = "nationality"
        const val COL_BIRTH_DATE = "birth_date"
        const val COL_TAX_CODE = "tax_code"
        const val COL_MEDICAL_HISTORY = "medical_history"
        const val COL_CREATION_DATE = "creation_date"
    }
}


