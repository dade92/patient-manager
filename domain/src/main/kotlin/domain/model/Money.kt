package domain.model

import java.math.BigDecimal
import java.math.RoundingMode

data class Money(
    val amount: BigDecimal,
    val currency: String = EUR
) {
    override fun toString(): String = "$amount $currency"

    companion object {
        const val EUR = "EUR"
    }
}

fun BigDecimal.round(): BigDecimal = this.setScale(2, RoundingMode.HALF_UP)