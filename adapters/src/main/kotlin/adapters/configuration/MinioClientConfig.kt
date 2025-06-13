package adapters.configuration

import adapters.MinioStorageService
import domain.StorageService
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.S3Configuration
import java.net.URI

@Configuration
@EnableConfigurationProperties(BucketProperties::class)
class MinioClientConfig {

    @Bean
    fun s3Client(
        bucketProperties: BucketProperties
    ): S3Client =
        S3Client.builder()
            .credentialsProvider(
                StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(bucketProperties.username, bucketProperties.password)
                )
            )
            .endpointOverride(URI.create("http://${bucketProperties.host}:${bucketProperties.port}"))
            .region(Region.US_EAST_1)
            .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build())
            .build()

    @Bean
    fun minioStorageService(
        s3Client: S3Client,
        bucketProperties: BucketProperties
    ): StorageService =
        MinioStorageService(s3Client, bucketProperties.bucketName!!)
}
