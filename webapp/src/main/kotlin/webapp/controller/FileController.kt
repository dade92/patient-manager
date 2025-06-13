package webapp.controller

import domain.StorageService
import domain.UploadFileRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.io.InputStream

@RestController
@RequestMapping("/files")
class FileController(
    private val storageService: StorageService
) {

    @PostMapping("/upload")
    fun uploadFile(@RequestParam file: MultipartFile): ResponseEntity<*> =
        file.originalFilename?.let { name ->
            storageService.uploadFile(
                UploadFileRequest(
                    key = name,
                    contentLength = file.size,
                    contentType = file.contentType ?: MediaType.APPLICATION_OCTET_STREAM_VALUE,
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

        retrieve(response, filename, fileStream)
    }

    private fun retrieve(
        response: HttpServletResponse,
        filename: String,
        fileStream: InputStream
    ) {
        response.contentType = "application/octet-stream"
        response.setHeader("Content-Disposition", "attachment; filename=\"$filename\"")

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
}
