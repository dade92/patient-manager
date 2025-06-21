package adapters

import domain.model.Patient
import domain.model.PatientId
import domain.user.PatientRepository
import java.sql.ResultSet
import java.time.LocalDateTime
import javax.sql.DataSource

class JdbcPatientRepository(
    private val dataSource: DataSource
) : PatientRepository {

    override fun retrieve(patientId: PatientId): Patient? {
        val sql = "SELECT user_id, name, email, phone_number, address, city_of_residence, nationality, birth_date FROM `PATIENT` WHERE user_id = ?"

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
        val sql = "SELECT user_id, name, email, phone_number, address, city_of_residence, nationality, birth_date FROM `PATIENT` WHERE name LIKE ?"
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
            INSERT INTO `PATIENT` (user_id, name, email, phone_number, address, city_of_residence, nationality, birth_date, creation_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                statement.setDate(8, java.sql.Date.valueOf(patient.birthDate))
                statement.setTimestamp(9, java.sql.Timestamp.valueOf(now))

                statement.executeUpdate()
            }
        }

        return patient
    }

    private fun updatePatient(patient: Patient): Patient {
        val sql = """
            UPDATE `PATIENT` 
            SET name = ?, email = ?, phone_number = ?, address = ?, city_of_residence = ?, nationality = ?, birth_date = ? 
            WHERE user_id = ?
        """.trimIndent()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, patient.name)
                statement.setString(2, patient.email)
                statement.setString(3, patient.phoneNumber)
                statement.setString(4, patient.address)
                statement.setString(5, patient.cityOfResidence)
                statement.setString(6, patient.nationality)
                statement.setDate(7, java.sql.Date.valueOf(patient.birthDate))
                statement.setString(8, patient.id.value)

                statement.executeUpdate()
            }
        }

        return patient
    }

    private fun mapToPatient(resultSet: ResultSet): Patient =
        Patient(
            id = PatientId(resultSet.getString("user_id")),
            name = resultSet.getString("name"),
            email = resultSet.getString("email"),
            phoneNumber = resultSet.getString("phone_number"),
            address = resultSet.getString("address"),
            cityOfResidence = resultSet.getString("city_of_residence"),
            nationality = resultSet.getString("nationality"),
            birthDate = resultSet.getDate("birth_date").toLocalDate()
        )
}
