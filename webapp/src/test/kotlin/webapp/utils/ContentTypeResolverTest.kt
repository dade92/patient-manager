package webapp.utils

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource

class ContentTypeResolverTest {

    private val resolver = ContentTypeResolver()

    @ParameterizedTest(name = "{index} => ''{0}'' -> {1}")
    @CsvSource(
        "file.pdf, application/pdf",
        "FILE.PDF, application/pdf",
        "image.jpg, image/jpeg",
        "photo.JPEG, image/jpeg",
        "icon.png, image/png",
        "anim.gif, image/gif",
        "vector.svg, image/svg+xml",
        "readme.txt, text/plain",
        "index.html, text/html",
        "index.htm, text/html",
        "archive.zip, application/octet-stream",
        "noextension, application/octet-stream"
    )
    fun `getContentType resolves expected media type`(filename: String, expectedContentType: String) {
        val result = resolver.getContentType(filename)

        assertEquals(expectedContentType, result)
    }
}
