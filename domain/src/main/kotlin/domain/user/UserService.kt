package domain.user

import domain.generator.UserIdGenerator
import java.time.LocalDate

class UserService(
    private val userRepository: UserRepository,
    private val userIdGenerator: UserIdGenerator
) {

    fun retrieveUser(userId: UserId): User? = userRepository.retrieve(userId)

    fun createUser(name: String, email: String, birthDate: LocalDate): User =
        userRepository.save(
            User(
                id = userIdGenerator.get(),
                name = name,
                email = email,
                birthDate = birthDate
            )
        )

    fun searchUsersByName(name: String): List<User> = userRepository.searchByName(name)

}

