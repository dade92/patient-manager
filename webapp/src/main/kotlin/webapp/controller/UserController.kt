package webapp.controller

import domain.model.User
import domain.model.UserId
import domain.user.CreateUserRequest as DomainCreateUserRequest
import domain.user.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
@RequestMapping("/user")
class UserController(
    private val userService: UserService
) {

    @GetMapping("/{userId}")
    fun getUser(@PathVariable userId: String): ResponseEntity<User> {
        val user = userService.retrieveUser(UserId(userId))
        return if (user != null) {
            ResponseEntity.ok(user)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/search")
    fun searchUsers(@RequestParam name: String): ResponseEntity<SearchUsersResponse> {
        val users = userService.searchUsersByName(name)
        return ResponseEntity.ok(SearchUsersResponse(users))
    }

    @PostMapping
    fun createUser(@RequestBody request: CreateUserRequest): ResponseEntity<User> {
        val domainRequest = DomainCreateUserRequest(
            name = request.name,
            email = request.email,
            phoneNumber = request.phoneNumber,
            address = request.address,
            city = request.city,
            nationality = request.nationality,
            birthDate = request.birthDate
        )

        val user = userService.createUser(domainRequest)
        return ResponseEntity.status(HttpStatus.CREATED).body(user)
    }

    data class CreateUserRequest(
        val name: String,
        val email: String,
        val phoneNumber: String? = null,
        val address: String? = null,
        val city: String? = null,
        val nationality: String? = null,
        val birthDate: LocalDate
    )

    data class SearchUsersResponse(
        val users: List<User>
    )
}
