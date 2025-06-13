package adapters

import domain.StorageService
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.GetObjectRequest
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import java.io.InputStream

class MinioStorageService(
    private val s3Client: S3Client
) : StorageService {
    private val bucketName = "my-bucket"

    override fun uploadFile(key: String, inputStream: InputStream, contentLength: Long, contentType: String) {
        val putRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .contentType(contentType)
            .build()

        s3Client.putObject(putRequest, RequestBody.fromInputStream(inputStream, contentLength))
    }

    override fun getFile(key: String): InputStream {
        val getRequest = GetObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .build()

        return s3Client.getObject(getRequest)
    }
}
