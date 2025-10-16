package webapp.controller

import domain.model.UploadFileRequestBuilder.anUploadFileRequest
import domain.storage.StorageService
import domain.storage.UploadFileRequest
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.http.MediaType.APPLICATION_OCTET_STREAM_VALUE
import org.springframework.http.MediaType.APPLICATION_PDF_VALUE
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
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
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()
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
    }

    @Test
    fun `getFile returns file correctly`() {
        val fileName = "test-image.png"
        val fileContent = "This is test image content for testing file downloads.".toByteArray()

        every { contentTypeResolver.getContentType(fileName) } returns MediaType.IMAGE_PNG_VALUE
        every { storageService.getFile(fileName) } returns ByteArrayInputStream(fileContent)

        mockMvc.perform(
            get("/files")
                .param("filename", fileName)
        )
            .andExpect(status().isOk)
            .andExpect(header().string("Content-Disposition", "inline; filename=\"$fileName\""))
            .andExpect(content().contentType(MediaType.IMAGE_PNG_VALUE))
            .andExpect(content().bytes(fileContent))
    }

    @Test
    fun `getFile returns file with attachment content disposition for non-displayable types`() {
        val fileName = "test-file.xyz"
        val fileContent = "This is generic binary content for testing non-displayable file downloads.".toByteArray()

        every { contentTypeResolver.getContentType(fileName) } returns APPLICATION_OCTET_STREAM_VALUE
        every { storageService.getFile(fileName) } returns ByteArrayInputStream(fileContent)

        mockMvc.perform(
            get("/files")
                .param("filename", fileName)
        )
            .andExpect(status().isOk)
            .andExpect(header().string("Content-Disposition", "attachment; filename=\"$fileName\""))
            .andExpect(content().contentType(APPLICATION_OCTET_STREAM_VALUE))
            .andExpect(content().bytes(fileContent))
    }

    companion object {
        private val FILE_CONTENT = "test file content".toByteArray()
        private const val FILENAME = "test-document.pdf"
        private const val CONTENT_TYPE = APPLICATION_PDF_VALUE
    }
}