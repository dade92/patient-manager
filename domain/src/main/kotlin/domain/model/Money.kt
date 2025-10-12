package domain.model

import java.math.BigDecimal

data class Money(
    val amount: BigDecimal,
    val currency: String = EUR
) {
    override fun toString(): String = "$amount $currency"

    companion object {
        const val EUR = "EUR"
    }
}
