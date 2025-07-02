package domain.model

import java.math.BigDecimal

data class Money(
    val amount: BigDecimal,
    val currency: String = "USD"
) {
    companion object {
        fun of(amount: BigDecimal, currency: String = "EUR"): Money {
            return Money(amount, currency)
        }

        fun of(amount: Double, currency: String = "EUR"): Money {
            return Money(BigDecimal.valueOf(amount), currency)
        }

        fun zero(currency: String = "EUR"): Money {
            return Money(BigDecimal.ZERO, currency)
        }
    }

    override fun toString(): String = "$amount $currency"
}
