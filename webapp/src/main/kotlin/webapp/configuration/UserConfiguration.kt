package webapp.configuration

import adapters.JdbcUserRepository
import domain.generator.UserIdGenerator
import domain.user.UserRepository
import domain.user.UserService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class UserConfiguration {

    @Bean
    fun userRepository(): UserRepository = JdbcUserRepository()

    @Bean
    fun userIdGenerator(): UserIdGenerator = UserIdGenerator()

    @Bean
    fun userService(userRepository: UserRepository, userIdGenerator: UserIdGenerator): UserService = UserService(
        userRepository = userRepository,
        userIdGenerator = userIdGenerator
    )
}
