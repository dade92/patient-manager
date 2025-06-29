package webapp.configuration

import domain.utils.DefaultInstantProvider
import domain.utils.InstantProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class UtilsConfiguration {

    @Bean
    fun instantProvider(): InstantProvider = DefaultInstantProvider()
}
