package webapp.controller

import domain.storage.StorageService
import io.mockk.Called
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType.APPLICATION_OCTET_STREAM_VALUE
import org.springframework.http.MediaType.APPLICATION_PDF_VALUE
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import webapp.utils.ContentTypeResolver
import java.io.ByteArrayInputStream

class FileControllerTest {

    private lateinit var mockMvc: MockMvc
    private val storageService = mockk<StorageService>()
    private val contentTypeResolver = mockk<ContentTypeResolver>()

    @BeforeEach
    fun setUp() {
        val controller = FileController(storageService, contentTypeResolver)
        mockMvc = MockMvcBuilders
            .standaloneSetup(controller)
            .setControllerAdvice(GlobalExceptionHandler())
            .build()
    }

    @Test
    fun `uploadFile returns 204 when file is uploaded successfully`() {
        val file = MockMultipartFile(
            "file",
            FILENAME,
            CONTENT_TYPE,
            FILE_CONTENT
        )

        every {
            storageService.uploadFile(match { request ->
                request.key == FILENAME &&
                        request.contentLength == 17L &&
                        request.contentType == CONTENT_TYPE
            })
        } returns Unit

        mockMvc.perform(
            multipart("/files/upload")
                .file(file)
        ).andExpect(status().isNoContent)
    }

    @Test
    fun `uploadFile returns 400 when filename is missing`() {
        val file = MockMultipartFile(
            "file",
            null,
            APPLICATION_PDF_VALUE,
            "test content".toByteArray()
        )

        mockMvc.perform(
            multipart("/files/upload").file(file)
        )
            .andExpect(status().isBadRequest)
            .andExpect(content().string("File name is missing"))
        verify { storageService wasNot Called }
    }

    @Test
    fun `uploadFile returns 500 when service throws an exception`() {
        val file = MockMultipartFile(
            "file",
            FILENAME,
            CONTENT_TYPE,
            FILE_CONTENT
        )

        every {
            storageService.uploadFile(any())
        } throws RuntimeException("Storage service unavailable")

        mockMvc.perform(
            multipart("/files/upload")
                .file(file)
        ).andExpect(status().isInternalServerError)
    }

    @Test
    fun `getFile returns file correctly`() {
        every { contentTypeResolver.getContentType(FILENAME) } returns CONTENT_TYPE
        every { storageService.getFile(FILENAME) } returns ByteArrayInputStream(FILE_CONTENT)

        mockMvc.perform(
            get("/files")
                .param("filename", FILENAME)
        )
            .andExpect(status().isOk)
            .andExpect(header().string("Content-Disposition", "inline; filename=\"$FILENAME\""))
            .andExpect(content().contentType(CONTENT_TYPE))
            .andExpect(content().bytes(FILE_CONTENT))
    }

    @Test
    fun `getFile returns file with attachment content disposition for non-displayable types`() {
        every { contentTypeResolver.getContentType(FILENAME) } returns NON_DISPLAYABLE_CONTENT_TYPE
        every { storageService.getFile(FILENAME) } returns ByteArrayInputStream(FILE_CONTENT)

        mockMvc.perform(
            get("/files")
                .param("filename", FILENAME)
        )
            .andExpect(status().isOk)
            .andExpect(header().string("Content-Disposition", "attachment; filename=\"$FILENAME\""))
            .andExpect(content().contentType(NON_DISPLAYABLE_CONTENT_TYPE))
            .andExpect(content().bytes(FILE_CONTENT))
    }

    companion object {
        private val FILE_CONTENT = "test file content".toByteArray()
        private const val FILENAME = "test-document.pdf"
        private const val CONTENT_TYPE = APPLICATION_PDF_VALUE
        private const val NON_DISPLAYABLE_CONTENT_TYPE = APPLICATION_OCTET_STREAM_VALUE
    }
}