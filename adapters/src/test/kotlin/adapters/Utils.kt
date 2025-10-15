package adapters

import org.h2.tools.RunScript
import java.io.InputStreamReader
import java.nio.charset.StandardCharsets
import javax.sql.DataSource
import kotlin.use

object Utils {
    fun runSql(resourcePath: String, source: DataSource) {
        source.connection.use { conn ->
            val input = this::class.java.getResourceAsStream(resourcePath)
                ?: throw IllegalStateException("Resource not found: $resourcePath")
            InputStreamReader(input, StandardCharsets.UTF_8).use { reader ->
                RunScript.execute(conn, reader)
            }
        }
    }
}