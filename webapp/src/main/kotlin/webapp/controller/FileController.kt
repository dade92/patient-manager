package webapp.controller

import domain.storage.StorageService
import domain.storage.UploadFileRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import webapp.utils.ContentTypeResolver
import java.io.InputStream

@RestController
@RequestMapping("/files")
class FileController(
    private val storageService: StorageService,
    private val contentTypeResolver: ContentTypeResolver
) {

    @PostMapping("/upload")
    fun uploadFile(@RequestParam file: MultipartFile): ResponseEntity<*> =
        file.originalFilename?.let { filename ->
            storageService.uploadFile(
                UploadFileRequest(
                    key = filename,
                    contentLength = file.size,
                    contentType = file.contentType ?: DEFAULT_CONTENT_TYPE,
                    inputStream = file.inputStream
                )
            )
            ResponseEntity.noContent().build<Any>()
        } ?: ResponseEntity.badRequest().body("File name is missing")

    @GetMapping
    fun getFile(
        @RequestParam filename: String,
        response: HttpServletResponse
    ) {
        val fileStream = storageService.getFile(filename)

        val contentType = contentTypeResolver.getContentType(filename)

        retrieve(response, filename, fileStream, contentType)
    }

    private fun retrieve(
        response: HttpServletResponse,
        filename: String,
        fileStream: InputStream,
        contentType: String
    ) {
        response.contentType = contentType

        // Only set Content-Disposition to "attachment" for files that should be downloaded
        // For files that can be displayed in browser, use "inline"
        val disposition = if (isDisplayableInBrowser(contentType)) "inline" else "attachment"
        response.setHeader("Content-Disposition", "$disposition; filename=\"$filename\"")

        fileStream.use { input ->
            response.outputStream.use { output ->
                val buffer = ByteArray(8192)
                var bytesRead: Int
                while (input.read(buffer).also { bytesRead = it } != -1) {
                    output.write(buffer, 0, bytesRead)
                }
            }
        }
    }

    private fun isDisplayableInBrowser(contentType: String): Boolean {
        // List of content types that most browsers can display natively
        val browserDisplayableTypes = listOf(
            "application/pdf",
            "image/jpeg", "image/png", "image/gif", "image/svg+xml",
            "text/plain", "text/html",
            "video/mp4",
            "audio/mpeg"
        )
        return browserDisplayableTypes.contains(contentType)
    }

    companion object {
        private const val DEFAULT_CONTENT_TYPE = MediaType.APPLICATION_OCTET_STREAM_VALUE
    }
}
