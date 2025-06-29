package domain.utils

import java.time.Instant

interface InstantProvider {
    fun now(): Instant
}

class DefaultInstantProvider : InstantProvider {
    override fun now(): Instant = Instant.now()
}