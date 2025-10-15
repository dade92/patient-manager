package domain.model

import domain.model.Money.Companion.EUR
import java.math.BigDecimal

object MoneyBuilder {

    fun aMoney(
        amount: BigDecimal = 123.45.toBigDecimal(),
        currency: String = EUR
    ) = Money(
        amount = amount,
        currency = currency
    )

}