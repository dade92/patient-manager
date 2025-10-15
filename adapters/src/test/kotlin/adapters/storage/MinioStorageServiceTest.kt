package adapters.storage

import domain.storage.UploadFileRequest
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
        val request = UploadFileRequest(
            key = "folder/file.png",
            contentLength = bytes.size.toLong(),
            contentType = "image/png",
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
        // Ensure the content length has been set correctly in the RequestBody
        assertEquals(request.contentLength, capturedBody.contentLength())

        verify(exactly = 1) { s3Client.putObject(any<PutObjectRequest>(), any<RequestBody>()) }
    }

    @Test
    fun `getFile delegates to s3 and returns input stream`() {
        val key = "folder/file.pdf"
        val expectedStream = mockk<ResponseInputStream<GetObjectResponse>>()

        val reqSlot = slot<GetObjectRequest>()
        every { s3Client.getObject(capture(reqSlot)) } returns expectedStream

        val result = service.getFile(key)

        assertEquals(bucketName, reqSlot.captured.bucket())
        assertEquals(key, reqSlot.captured.key())
        assertEquals(expectedStream, result)

        verify(exactly = 1) { s3Client.getObject(any<GetObjectRequest>()) }
    }
}
