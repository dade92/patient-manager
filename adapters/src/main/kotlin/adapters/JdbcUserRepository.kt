package adapters

import domain.model.User
import domain.model.UserId
import domain.user.UserRepository
import java.sql.ResultSet
import javax.sql.DataSource

class JdbcUserRepository(
    private val dataSource: DataSource
) : UserRepository {

    override fun retrieve(userId: UserId): User? {
        val sql = "SELECT user_id, name, email, phone_number, address, city_of_residence, nationality, birth_date FROM users WHERE user_id = ?"

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, userId.value)
                statement.executeQuery().use { resultSet ->
                    if (resultSet.next()) {
                        return mapToUser(resultSet)
                    }
                }
            }
        }

        return null
    }

    override fun save(user: User): User {
        val existingUser = retrieve(user.id)

        return if (existingUser == null) {
            insertUser(user)
        } else {
            updateUser(user)
        }
    }

    override fun searchByName(name: String): List<User> {
        val sql = "SELECT user_id, name, email, phone_number, address, city_of_residence, nationality, birth_date FROM users WHERE name LIKE ?"
        val users = mutableListOf<User>()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, "%$name%")
                statement.executeQuery().use { resultSet ->
                    while (resultSet.next()) {
                        users.add(mapToUser(resultSet))
                    }
                }
            }
        }

        return users
    }

    private fun insertUser(user: User): User {
        val sql = """
            INSERT INTO users (user_id, name, email, phone_number, address, city_of_residence, nationality, birth_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """.trimIndent()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, user.id.value)
                statement.setString(2, user.name)
                statement.setString(3, user.email)
                statement.setString(4, user.phoneNumber)
                statement.setString(5, user.address)
                statement.setString(6, user.cityOfResidence)
                statement.setString(7, user.nationality)
                statement.setDate(8, java.sql.Date.valueOf(user.birthDate))

                statement.executeUpdate()
            }
        }

        return user
    }

    private fun updateUser(user: User): User {
        val sql = """
            UPDATE users 
            SET name = ?, email = ?, phone_number = ?, address = ?, city_of_residence = ?, nationality = ?, birth_date = ? 
            WHERE user_id = ?
        """.trimIndent()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, user.name)
                statement.setString(2, user.email)
                statement.setString(3, user.phoneNumber)
                statement.setString(4, user.address)
                statement.setString(5, user.cityOfResidence)
                statement.setString(6, user.nationality)
                statement.setDate(7, java.sql.Date.valueOf(user.birthDate))
                statement.setString(8, user.id.value)

                statement.executeUpdate()
            }
        }

        return user
    }

    private fun mapToUser(resultSet: ResultSet): User =
        User(
            id = UserId(resultSet.getString("user_id")),
            name = resultSet.getString("name"),
            email = resultSet.getString("email"),
            phoneNumber = resultSet.getString("phone_number"),
            address = resultSet.getString("address"),
            cityOfResidence = resultSet.getString("city_of_residence"),
            nationality = resultSet.getString("nationality"),
            birthDate = resultSet.getDate("birth_date").toLocalDate()
        )
}
