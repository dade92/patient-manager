package adapters.storage

import domain.storage.StorageService
import domain.storage.UploadFileRequest
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.GetObjectRequest
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import java.io.InputStream

class MinioStorageService(
    private val s3Client: S3Client,
    private val bucketName: String
) : StorageService {
    override fun uploadFile(request: UploadFileRequest) {
        val putRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(request.key)
            .contentType(request.contentType)
            .build()

        s3Client.putObject(
            putRequest,
            RequestBody.fromInputStream(request.inputStream, request.contentLength)
        )
    }

    override fun getFile(key: String): InputStream {
        val getRequest = GetObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .build()

        return s3Client.getObject(getRequest)
    }
}