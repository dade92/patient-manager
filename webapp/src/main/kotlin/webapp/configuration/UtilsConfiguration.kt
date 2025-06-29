package webapp.configuration

import domain.utils.DefaultDateTimeProvider
import domain.utils.DateTimeProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class UtilsConfiguration {

    @Bean
    fun instantProvider(): DateTimeProvider = DefaultDateTimeProvider()
}
