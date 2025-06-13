package domain

import java.io.InputStream

interface StorageService {
    fun uploadFile(key: String, inputStream: InputStream, contentLength: Long, contentType: String)
    fun getFile(key: String): InputStream
}