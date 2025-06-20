package adapters.configuration

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "spring.datasource")
class DatabaseProperties {
    var url: String = ""
    var username: String = ""
    var password: String = ""
    var driverClassName: String = ""
}
