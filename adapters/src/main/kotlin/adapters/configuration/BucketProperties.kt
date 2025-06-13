package adapters.configuration

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "bucket")
class BucketProperties {
    var host: String? = null
    var port: Int? = null
    var username: String? = null
    var password: String? = null
}