package domain.generator

import domain.user.UserId
import java.util.UUID

class UserIdGenerator {
    fun get(): UserId = UserId(UUID.randomUUID().toString())
}