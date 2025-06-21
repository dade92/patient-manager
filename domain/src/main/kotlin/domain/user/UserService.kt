package domain.user

import domain.generator.UserIdGenerator
import domain.model.User
import domain.model.UserId
import java.time.LocalDate

data class CreateUserRequest(
    val name: String,
    val email: String,
    val phoneNumber: String? = null,
    val address: String? = null,
    val cityOfResidence: String? = null,
    val nationality: String? = null,
    val birthDate: LocalDate
)

class UserService(
    private val userRepository: UserRepository,
    private val userIdGenerator: UserIdGenerator
) {

    fun retrieveUser(userId: UserId): User? = userRepository.retrieve(userId)

    fun createUser(request: CreateUserRequest): User =
        userRepository.save(
            User(
                id = userIdGenerator.get(),
                name = request.name,
                email = request.email,
                phoneNumber = request.phoneNumber,
                address = request.address,
                cityOfResidence = request.cityOfResidence,
                nationality = request.nationality,
                birthDate = request.birthDate
            )
        )

    fun searchUsersByName(name: String): List<User> = userRepository.searchByName(name)

}
