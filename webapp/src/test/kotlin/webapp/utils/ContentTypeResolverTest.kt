package webapp.utils

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource

class ContentTypeResolverTest {

    private val resolver = ContentTypeResolver()

    @ParameterizedTest(name = "{index} => '{0}' -> {1}")
    @CsvSource(
        // PDF
        "file.pdf, application/pdf",
        "FILE.PDF, application/pdf",
        // JPEG
        "image.jpg, image/jpeg",
        "photo.JPEG, image/jpeg",
        // PNG
        "icon.png, image/png",
        // GIF
        "anim.gif, image/gif",
        // SVG
        "vector.svg, image/svg+xml",
        // TXT
        "readme.txt, text/plain",
        // HTML/HTM
        "index.html, text/html",
        "index.htm, text/html",
        // Default (unknown)
        "archive.zip, application/octet-stream",
        "noextension, application/octet-stream"
    )
    fun `getContentType resolves expected media type`(filename: String, expectedContentType: String) {
        val result = resolver.getContentType(filename)
        assertEquals(expectedContentType, result)
    }
}
