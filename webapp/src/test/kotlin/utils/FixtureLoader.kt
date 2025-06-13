package utils

import java.nio.charset.StandardCharsets

object FixtureLoader {
    @JvmStatic
    fun readFile(path: String): String = this.javaClass.getResource(path)!!.readText(StandardCharsets.UTF_8)
}