package domain.utils

import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId

interface DateTimeProvider {
    fun now(): LocalDateTime
}

class DefaultDateTimeProvider : DateTimeProvider {
    override fun now(): LocalDateTime = LocalDateTime.ofInstant(Instant.now(), ZoneId.of("Europe/Rome"))
}