package webapp.utils

import org.springframework.http.MediaType

class ContentTypeResolver {
    fun getContentType(filename: String): String =
        when {
            filename.endsWith(".pdf", ignoreCase = true) -> "application/pdf"
            filename.endsWith(".jpg", ignoreCase = true) || filename.endsWith(
                ".jpeg",
                ignoreCase = true
            ) -> "image/jpeg"

            filename.endsWith(".png", ignoreCase = true) -> "image/png"
            filename.endsWith(".gif", ignoreCase = true) -> "image/gif"
            filename.endsWith(".svg", ignoreCase = true) -> "image/svg+xml"
            filename.endsWith(".txt", ignoreCase = true) -> "text/plain"
            filename.endsWith(".html", ignoreCase = true) || filename.endsWith(".htm", ignoreCase = true) -> "text/html"
            filename.endsWith(".mp4", ignoreCase = true) -> "video/mp4"
            filename.endsWith(".mp3", ignoreCase = true) -> "audio/mpeg"
            filename.endsWith(".doc", ignoreCase = true) -> "application/msword"
            filename.endsWith(
                ".docx",
                ignoreCase = true
            ) -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

            filename.endsWith(".xls", ignoreCase = true) -> "application/vnd.ms-excel"
            filename.endsWith(
                ".xlsx",
                ignoreCase = true
            ) -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

            else -> DEFAULT_CONTENT_TYPE
        }

    companion object {
        private const val DEFAULT_CONTENT_TYPE = MediaType.APPLICATION_OCTET_STREAM_VALUE
    }
}
