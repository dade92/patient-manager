package adapters

import domain.user.User
import domain.user.UserId
import domain.user.UserRepository

class JdbcUserRepository : UserRepository {

    override fun retrieve(userId: UserId): User? {
        return null // Placeholder return
    }

    override fun save(user: User): User {
        return user // Placeholder return
    }
}