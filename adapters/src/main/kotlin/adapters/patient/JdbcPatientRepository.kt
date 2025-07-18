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
            "SELECT patient_id, name, email, phone_number, address, city_of_residence, nationality, birth_date, tax_code FROM `PATIENT` WHERE patient_id = ?"

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
            "SELECT patient_id, name, email, phone_number, address, city_of_residence, nationality, birth_date, tax_code FROM `PATIENT` WHERE name LIKE ?"
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

    private fun insertPatient(patient: Patient): Patient {
        val sql = """
            INSERT INTO `PATIENT` (patient_id, name, email, phone_number, address, city_of_residence, nationality, birth_date, tax_code, creation_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """.trimIndent()

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

                statement.executeUpdate()
            }
        }

        return patient
    }

    private fun updatePatient(patient: Patient): Patient {
        val sql = """
            UPDATE `PATIENT` 
            SET name = ?, email = ?, phone_number = ?, address = ?, city_of_residence = ?, nationality = ?, birth_date = ?, tax_code = ? 
            WHERE patient_id = ?
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
                statement.setString(9, patient.id.value)

                statement.executeUpdate()
            }
        }

        return patient
    }

    private fun mapToPatient(resultSet: ResultSet): Patient =
        Patient(
            id = PatientId(resultSet.getString("patient_id")),
            name = resultSet.getString("name"),
            email = resultSet.getString("email"),
            phoneNumber = resultSet.getString("phone_number"),
            address = resultSet.getString("address"),
            cityOfResidence = resultSet.getString("city_of_residence"),
            nationality = resultSet.getString("nationality"),
            birthDate = resultSet.getDate("birth_date").toLocalDate(),
            taxCode = resultSet.getString("tax_code")
        )
}


