package adapters.configuration

import adapters.MinioStorageService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.S3Configuration
import java.net.URI

@Configuration
class MinioClientConfig {
    @Bean
    fun s3Client(): S3Client {
        return S3Client.builder()
            .credentialsProvider(
                StaticCredentialsProvider.create(
                    AwsBasicCredentials.create("minioadmin", "minioadmin")
                )
            )
            .endpointOverride(URI.create("http://localhost:9000"))
            .region(Region.US_EAST_1)
            .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build())
            .build()
    }

    @Bean
    fun minioStorageService(s3Client: S3Client): MinioStorageService =
        MinioStorageService(s3Client)
}
