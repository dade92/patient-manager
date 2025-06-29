package domain.generator

import domain.model.OperationId
import java.util.*

class OperationIdGenerator {
    fun get(): OperationId = OperationId(UUID.randomUUID().toString())
}
