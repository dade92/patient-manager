package webapp.configuration

import org.springframework.boot.autoconfigure.cache.CacheProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Configuration

@Configuration
@EnableCaching
@EnableConfigurationProperties(CacheProperties::class)
class CacheConfiguration
