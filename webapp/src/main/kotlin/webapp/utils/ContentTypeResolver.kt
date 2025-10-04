package webapp.utils

import org.springframework.http.MediaType

class ContentTypeResolver {
    fun getContentType(filename: String): String =
        when {
            filename.endsWith(".pdf", ignoreCase = true) -> PDF_CONTENT_TYPE
            filename.endsWith(".jpg", ignoreCase = true) || filename.endsWith(
                ".jpeg",
                ignoreCase = true
            ) -> JPEG_CONTENT_TYPE

            filename.endsWith(".png", ignoreCase = true) -> PNG_CONTENT_TYPE
            filename.endsWith(".gif", ignoreCase = true) -> GIF_CONTENT_TYPE
            filename.endsWith(".svg", ignoreCase = true) -> SVG_CONTENT_TYPE
            filename.endsWith(".txt", ignoreCase = true) -> TXT_CONTENT_TYPE
            filename.endsWith(".html", ignoreCase = true) || filename.endsWith(
                ".htm",
                ignoreCase = true
            ) -> HTML_CONTENT_TYPE

            else -> DEFAULT_CONTENT_TYPE
        }

    companion object {
        private const val DEFAULT_CONTENT_TYPE = MediaType.APPLICATION_OCTET_STREAM_VALUE
        private const val PDF_CONTENT_TYPE = "application/pdf"
        private const val JPEG_CONTENT_TYPE = "image/jpeg"
        private const val PNG_CONTENT_TYPE = "image/png"
        private const val GIF_CONTENT_TYPE = "image/gif"
        private const val SVG_CONTENT_TYPE = "image/svg+xml"
        private const val TXT_CONTENT_TYPE = "text/plain"
        private const val HTML_CONTENT_TYPE = "text/html"
    }
}
