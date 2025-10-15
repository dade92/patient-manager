package adapters.storage

import domain.model.UploadFileRequestBuilder.anUploadFileRequest
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import software.amazon.awssdk.core.ResponseInputStream
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.GetObjectRequest
import software.amazon.awssdk.services.s3.model.GetObjectResponse
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import software.amazon.awssdk.services.s3.model.PutObjectResponse
import java.io.ByteArrayInputStream

class MinioStorageServiceTest {

    private val s3Client: S3Client = mockk()
    private val bucketName = "test-bucket"

    private val service = MinioStorageService(s3Client, bucketName)

    @Test
    fun `uploadFile delegates to s3 with correct request`() {
        val bytes = byteArrayOf(1, 2, 3, 4)
        val input = ByteArrayInputStream(bytes)
        val request = anUploadFileRequest(
            key = KEY,
            contentLength = bytes.size.toLong(),
            contentType = CONTENT_TYPE,
            inputStream = input
        )

        val putRequestSlot = slot<PutObjectRequest>()
        val bodySlot = slot<RequestBody>()

        every { s3Client.putObject(capture(putRequestSlot), capture(bodySlot)) } returns mockk<PutObjectResponse>()

        service.uploadFile(request)

        val capturedPut = putRequestSlot.captured
        assertEquals(bucketName, capturedPut.bucket())
        assertEquals(request.key, capturedPut.key())
        assertEquals(request.contentType, capturedPut.contentType())

        val capturedBody = bodySlot.captured

        assertEquals(request.contentLength, capturedBody.contentLength())
    }

    @Test
    fun `getFile delegates to s3 and returns input stream`() {
        val expectedStream = mockk<ResponseInputStream<GetObjectResponse>>()

        val reqSlot = slot<GetObjectRequest>()
        every { s3Client.getObject(capture(reqSlot)) } returns expectedStream

        val result = service.getFile(KEY)

        assertEquals(bucketName, reqSlot.captured.bucket())
        assertEquals(KEY, reqSlot.captured.key())
        assertEquals(expectedStream, result)

        verify(exactly = 1) { s3Client.getObject(any<GetObjectRequest>()) }
    }

    companion object {
        private const val KEY = "folder/file.pdf"
        private const val CONTENT_TYPE = "image/png"
    }
}
