package webapp.configuration

import domain.utils.DateTimeProvider
import domain.utils.DefaultDateTimeProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import webapp.utils.ContentTypeResolver

@Configuration
class UtilsConfiguration {

    @Bean
    fun instantProvider(): DateTimeProvider = DefaultDateTimeProvider()

    @Bean
    fun contentTypeResolver(): ContentTypeResolver = ContentTypeResolver()
}
