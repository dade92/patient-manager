package webapp.controller

import domain.StorageService
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/files")
class FileController(
    private val storageService: StorageService
) {

    @PostMapping("/upload")
    fun uploadFile(@RequestParam file: MultipartFile): ResponseEntity<String> {
        storageService.uploadFile(
            key = file.originalFilename ?: "unnamed",
            inputStream = file.inputStream,
            contentLength = file.size,
            contentType = file.contentType ?: MediaType.APPLICATION_OCTET_STREAM_VALUE
        )
        return ResponseEntity.ok("File uploaded successfully.")
    }

    @GetMapping("/{filename}")
    fun getFile(
        @PathVariable filename: String,
        response: HttpServletResponse
    ) {
        val fileStream = storageService.getFile(filename)

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
