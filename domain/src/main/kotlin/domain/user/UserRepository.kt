package domain.user

import java.time.LocalDate

interface UserRepository {
    fun retrieve(userId: UserId): User?
    fun save(user: User): User
}

@JvmInline
value class UserId(val value: String) {
    override fun toString(): String = value
}

data class User(
    val id: UserId,
    val name: String,
    val email: String,
    val birthDate: LocalDate
)