package domain

import java.io.InputStream

interface StorageService {
    fun uploadFile(request: UploadFileRequest)
    fun getFile(key: String): InputStream
}

data class UploadFileRequest(
    val key: String,
    val contentLength: Long,
    val contentType: String,
    val inputStream: InputStream
)