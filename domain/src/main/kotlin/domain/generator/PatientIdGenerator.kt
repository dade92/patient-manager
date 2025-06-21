package domain.generator

import domain.model.PatientId
import java.util.*

class PatientIdGenerator {
    fun get(): PatientId = PatientId(UUID.randomUUID().toString())
}