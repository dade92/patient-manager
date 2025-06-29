package domain.utils

import java.time.Instant

interface InstantProvider {
    fun now(): Instant
}

class SystemInstantProvider : InstantProvider {
    override fun now(): Instant = Instant.now()
}