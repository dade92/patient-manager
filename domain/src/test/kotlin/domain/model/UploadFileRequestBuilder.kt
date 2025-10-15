package domain.model

import domain.storage.UploadFileRequest
import java.io.ByteArrayInputStream

object UploadFileRequestBuilder {
    fun anUploadFileRequest(
        key: String = "key",
        contentLength: Long = 100,
        contentType: String = "text/plain",
        inputStream: ByteArrayInputStream = "test".byteInputStream()
    ) = UploadFileRequest(
        key = key,
        contentLength = contentLength,
        contentType = contentType,
        inputStream = inputStream
    )
}