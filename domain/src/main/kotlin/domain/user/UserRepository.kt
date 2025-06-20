package domain.user

import domain.model.User
import domain.model.UserId

interface UserRepository {
    fun retrieve(userId: UserId): User?
    fun save(user: User): User
    fun searchByName(name: String): List<User>
}

